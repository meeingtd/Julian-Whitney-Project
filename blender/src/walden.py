"""Walden Pond, winter going to dusk, as Blender-rendered layers for the painted scene (painted/12_walden.js).
Same world as the painting: x right, y up, z toward the viewer; the ice at y -2 from z 3 back to the shore at z -30; the ridge at z -60.
Four layers, each rendered alone with a transparent background (the sky is drawn live in the page), but every layer still casts its
shadows and shows in reflections on the others. Two camera sets: 'land' (desktop, fov 50) and 'port' (phones, fov 68), framed from the
page camera recorded in walden_cams.json. Each image covers a world rectangle at the reference depth ZR; walden_frames.json says which.
Run: /Applications/Blender.app/Contents/MacOS/Blender -b -P blender/src/walden.py [-- land|port [layer ...]]
"""
import sys, os, math, json, random
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
import bpy, bmesh
from mathutils import Vector, Matrix, noise
from export import ROOT, V, material, link, mesh_obj, lathe

HERE = os.path.dirname(os.path.abspath(__file__))
args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
SETS = [a for a in args if a in ("land", "port")] or ["land", "port"]
ONLY = [a for a in args if a not in ("land", "port")]
LAYERS = {"far": -60, "shore": -32, "ice": -6, "near": 1}
ZR = -32
PX = {"land": 32, "port": 24}            # pixels per world unit at the reference depth
ASP = {"land": 2.4, "port": 1.0}         # widest screen each set must cover (ultrawide / square tablet)
DWELL = {"land": (0, .5, 9.3), "port": (0, .45, 14.0)}
MARGIN = 1.12
OUT = os.path.join(ROOT, "renders", "walden")
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.view_settings.view_transform = "Standard"
sc.render.engine = "CYCLES"
pr = bpy.context.preferences.addons["cycles"].preferences
pr.compute_device_type = "METAL"
pr.get_devices()
for d in pr.devices:
    d.use = True
sc.cycles.device = "GPU"
sc.cycles.samples = int(os.environ.get("SAMPLES", 128))
sc.cycles.use_denoising = True
sc.render.film_transparent = True
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGBA"
rnd = random.Random(7)

coll = {}
for k in LAYERS:
    c = bpy.data.collections.new(k)
    sc.collection.children.link(c)
    coll[k] = c


def put(obj, layer):
    for c in obj.users_collection:
        c.objects.unlink(obj)
    coll[layer].objects.link(obj)
    return obj


def clamp(x, a=0., b=1.):
    return max(a, min(b, x))


def smooth(a, b, t):
    t = clamp((t - a) / (b - a))
    return t * t * (3 - 2 * t)


def ridge(x, k):
    return math.sin(x * .11 + k) * 1.1 + math.sin(x * .27 + k * 2) * .5 + math.sin(x * .05 + k * 3) * 1.6


# ---- materials: every surface takes on the air with distance (aerial perspective, as the painting's air: 178,168,200) --------------
def airy(m, k0=30., span=60., strength=1.):
    """Mix the material toward the haze colour by its distance from the camera."""
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    surf = out.inputs["Surface"].links[0].from_socket
    cam = nt.nodes.new("ShaderNodeCameraData")
    f = nt.nodes.new("ShaderNodeMath"); f.operation = "SUBTRACT"; f.inputs[1].default_value = k0
    nt.links.new(cam.outputs["View Distance"], f.inputs[0])
    g = nt.nodes.new("ShaderNodeMath"); g.operation = "DIVIDE"; g.inputs[1].default_value = -span
    nt.links.new(f.outputs[0], g.inputs[0])
    e = nt.nodes.new("ShaderNodeMath"); e.operation = "EXPONENT"; nt.links.new(g.outputs[0], e.inputs[0])
    h = nt.nodes.new("ShaderNodeMath"); h.operation = "SUBTRACT"; h.inputs[0].default_value = 1; nt.links.new(e.outputs[0], h.inputs[1])
    c = nt.nodes.new("ShaderNodeMath"); c.operation = "MULTIPLY"; c.inputs[1].default_value = .62; c.use_clamp = True; nt.links.new(h.outputs[0], c.inputs[0])
    em = nt.nodes.new("ShaderNodeEmission"); em.inputs["Color"].default_value = (.445, .392, .578, 1); em.inputs["Strength"].default_value = strength
    mx = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(c.outputs[0], mx.inputs["Fac"]); nt.links.new(surf, mx.inputs[1]); nt.links.new(em.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], out.inputs["Surface"])
    return m


def bump(m, scale, strength, detail=4.):
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = scale; nz.inputs["Detail"].default_value = detail
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = strength
    nt.links.new(nz.outputs["Fac"], bp.inputs["Height"]); nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    return nz


def snow_mat(name, col=(.86, .87, .92), rough=.62):
    m = material(name, col, rough, 0)
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Subsurface Weight"].default_value = .08
    b.inputs["Subsurface Radius"].default_value = (.4, .5, .7)
    b.inputs["Subsurface Scale"].default_value = .05
    bump(m, 9, .12)
    return m


def snowy(name, base, snow_from=.35):
    """A dark material (bark, needles) with snow lying on whatever faces up."""
    m = material(name, base, .7, 0)
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ"); nt.links.new(geo.outputs["Normal"], sep.inputs["Vector"])
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 3.5; nz.inputs["Detail"].default_value = 3
    nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
    add = nt.nodes.new("ShaderNodeMath"); add.operation = "ADD"
    nt.links.new(sep.outputs["Z"], add.inputs[0])
    sc_ = nt.nodes.new("ShaderNodeMath"); sc_.operation = "MULTIPLY_ADD"; sc_.inputs[1].default_value = .7; sc_.inputs[2].default_value = -.35; nt.links.new(nz.outputs["Fac"], sc_.inputs[0])
    nt.links.new(sc_.outputs[0], add.inputs[1])
    mr = nt.nodes.new("ShaderNodeMapRange"); nt.links.new(add.outputs[0], mr.inputs["Value"])
    mr.inputs["From Min"].default_value, mr.inputs["From Max"].default_value = snow_from, snow_from + .12
    mix = nt.nodes.new("ShaderNodeMix"); mix.data_type = "RGBA"
    nt.links.new(mr.outputs["Result"], mix.inputs["Factor"])
    mix.inputs["A"].default_value = (*base, 1); mix.inputs["B"].default_value = (.84, .85, .9, 1)
    nt.links.new(mix.outputs["Result"], b.inputs["Base Color"])
    rr = nt.nodes.new("ShaderNodeMapRange"); nt.links.new(mr.outputs["Result"], rr.inputs["Value"])
    rr.inputs["To Min"].default_value, rr.inputs["To Max"].default_value = .75, .6
    nt.links.new(rr.outputs["Result"], b.inputs["Roughness"])
    return m


def ice_mat(clear=True, name="ice"):
    """Wind-packed snow over the pond, with patches of clear black ice holding the sky (clear=False: snow only, for the drift), long soft drifts and a crust that glitters."""
    m = material(name, (.86, .87, .92), .6, 0)
    nt = m.node_tree
    b = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (1, 1.7, 1)   # stretch the patches across the pond
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = .09; nz.inputs["Detail"].default_value = 5; nz.inputs["Roughness"].default_value = .55
    nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"])
    sepo = nt.nodes.new("ShaderNodeSeparateXYZ"); nt.links.new(tc.outputs["Object"], sepo.inputs["Vector"])
    far_ = nt.nodes.new("ShaderNodeMapRange"); nt.links.new(sepo.outputs["Y"], far_.inputs["Value"])   # Blender y = -three z
    far_.inputs["From Min"].default_value, far_.inputs["From Max"].default_value = 6, 10
    nzf = nt.nodes.new("ShaderNodeMath"); nzf.operation = "MULTIPLY"; nt.links.new(nz.outputs["Fac"], nzf.inputs[0]); nt.links.new(far_.outputs["Result"], nzf.inputs[1])
    mask = nt.nodes.new("ShaderNodeMapRange"); nt.links.new(nzf.outputs[0], mask.inputs["Value"])
    mask.inputs["From Min"].default_value, mask.inputs["From Max"].default_value = (.6, .64) if clear else (5, 6)
    col = nt.nodes.new("ShaderNodeMix"); col.data_type = "RGBA"; nt.links.new(mask.outputs["Result"], col.inputs["Factor"])
    col.inputs["A"].default_value = (.86, .87, .92, 1); col.inputs["B"].default_value = (.012, .014, .02, 1)
    nt.links.new(col.outputs["Result"], b.inputs["Base Color"])
    ro = nt.nodes.new("ShaderNodeMapRange"); nt.links.new(mask.outputs["Result"], ro.inputs["Value"])
    ro.inputs["To Min"].default_value, ro.inputs["To Max"].default_value = .62, .03
    nt.links.new(ro.outputs["Result"], b.inputs["Roughness"])
    # drifts: long low ridges of snow, and fine crust that catches the low sun
    mp2 = nt.nodes.new("ShaderNodeMapping"); mp2.inputs["Scale"].default_value = (.18, 2.2, 1)
    nt.links.new(tc.outputs["Object"], mp2.inputs["Vector"])
    dr = nt.nodes.new("ShaderNodeTexNoise"); dr.inputs["Scale"].default_value = 1.2; dr.inputs["Detail"].default_value = 3
    nt.links.new(mp2.outputs["Vector"], dr.inputs["Vector"])
    fine = nt.nodes.new("ShaderNodeTexNoise"); fine.inputs["Scale"].default_value = 60; fine.inputs["Detail"].default_value = 2
    nt.links.new(tc.outputs["Object"], fine.inputs["Vector"])
    h = nt.nodes.new("ShaderNodeMath"); h.operation = "MULTIPLY_ADD"; h.inputs[1].default_value = .15
    nt.links.new(fine.outputs["Fac"], h.inputs[0]); nt.links.new(dr.outputs["Fac"], h.inputs[2])
    keep = nt.nodes.new("ShaderNodeMath"); keep.operation = "SUBTRACT"; keep.inputs[0].default_value = 1; nt.links.new(mask.outputs["Result"], keep.inputs[1])
    hh = nt.nodes.new("ShaderNodeMath"); hh.operation = "MULTIPLY"; nt.links.new(h.outputs[0], hh.inputs[0]); nt.links.new(keep.outputs[0], hh.inputs[1])
    tint = nt.nodes.new("ShaderNodeMix"); tint.data_type = "RGBA"; nt.links.new(dr.outputs["Fac"], tint.inputs["Factor"])
    tint.inputs["A"].default_value = (.7, .74, .86, 1); tint.inputs["B"].default_value = (.92, .92, .95, 1)
    nt.links.new(tint.outputs["Result"], col.inputs["A"])
    vor = nt.nodes.new("ShaderNodeTexVoronoi"); vor.inputs["Scale"].default_value = 260; nt.links.new(tc.outputs["Object"], vor.inputs["Vector"])
    gl = nt.nodes.new("ShaderNodeMapRange"); nt.links.new(vor.outputs["Distance"], gl.inputs["Value"])
    gl.inputs["From Min"].default_value, gl.inputs["From Max"].default_value, gl.inputs["To Min"].default_value, gl.inputs["To Max"].default_value = 0, .07, 1, 0
    glk = nt.nodes.new("ShaderNodeMath"); glk.operation = "MULTIPLY"; nt.links.new(gl.outputs["Result"], glk.inputs[0]); nt.links.new(keep.outputs[0], glk.inputs[1])
    rmix = nt.nodes.new("ShaderNodeMix"); rmix.data_type = "FLOAT"; nt.links.new(glk.outputs[0], rmix.inputs["Factor"])
    nt.links.new(ro.outputs["Result"], rmix.inputs["A"]); rmix.inputs["B"].default_value = .06
    nt.links.new(rmix.outputs["Result"], b.inputs["Roughness"])
    bp = nt.nodes.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = .55; bp.inputs["Distance"].default_value = .05
    nt.links.new(hh.outputs[0], bp.inputs["Height"]); nt.links.new(bp.outputs["Normal"], b.inputs["Normal"])
    b.inputs["Subsurface Weight"].default_value = .06
    b.inputs["Subsurface Radius"].default_value = (.4, .5, .7)
    b.inputs["Subsurface Scale"].default_value = .05
    return m


M_SNOW = airy(snow_mat("snow"))
M_ICE = airy(ice_mat())
M_PINE = airy(snowy("pine", (.010, .022, .016), .78))
M_BARK = airy(snowy("bark", (.05, .035, .03), .8))
M_HOUSE = airy(material("bathhouse", (.17, .11, .085), .8))
M_ROOF = airy(snow_mat("roof"))
M_ROAD = airy(material("road", (.32, .3, .33), .9))
M_WIN = material("window", (1, .7, .35), .5)
w = M_WIN.node_tree.nodes["Principled BSDF"]
w.inputs["Emission Color"].default_value = (1, .62, .3, 1)
w.inputs["Emission Strength"].default_value = 6


def grid(name, x0, x1, z0, z1, step, height, mat, layer):
    """A height-field mesh over x (left-right) and z (depth), in three.js coordinates."""
    bm = bmesh.new()
    nx, nz = max(2, int((x1 - x0) / step) + 1), max(2, int(abs(z1 - z0) / step) + 1)
    vs = [[bm.verts.new(V(x0 + i * step, height(x0 + i * step, z0 + j * (z1 - z0) / (nz - 1)), z0 + j * (z1 - z0) / (nz - 1))) for i in range(nx)] for j in range(nz)]
    for j in range(nz - 1):
        for i in range(nx - 1):
            f = bm.faces.new((vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]))
    bm.normal_update()
    for f in bm.faces:
        if f.normal.z < 0:
            f.normal_flip()
    return put(mesh_obj(name, bm, mat), layer)


# ---- the ice ---------------------------------------------------------------------------------------------------------------
grid("pond", -130, 130, 16, -30.4, 2, lambda x, z: -2, M_ICE, "ice")


# ---- the shore: beach bank, road, the snowy hill, the bathhouse ------------------------------------------------------------
def top(x):
    return -2 + 2.6 + max(0, ridge(x, 3)) * 1.3 + (min(3.4, (abs(x) - 10) * .16) if abs(x) > 10 else 0)


def hill(x, z):
    t = smooth(-30.6, -34.6, z)
    y = -2 + (top(x) + 2) * t + max(0, -34.6 - z) * .14
    bank = smooth(-30.0, -30.8, z) * (1 - t)
    y += bank * .45
    return y + noise.noise(Vector((x * .25, z * .25, 0))) * .25 * t


grid("hill", -95, 95, -30.0, -52, .4, hill, M_SNOW, "shore")
grid("road", -10, 14, -31.0, -31.45, .5, lambda x, z: hill(x, z) + .012, M_ROAD, "shore")


def box(name, c, s, mat, layer):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1)
    for v in bm.verts:
        v.co = Vector((v.co.x * s[0], v.co.y * s[2], v.co.z * s[1])) + c
    return put(mesh_obj(name, bm, mat, smooth=False), layer)


hb = hill(7.3, -31.6)
box("bathhouse", V(7.3, hb + .45, -31.9), (2.6, .95, 1.4), M_HOUSE, "shore")
roof = bmesh.new()
a, b_, c_, d_ = V(5.85, hb + .93, -31.1), V(8.75, hb + .93, -31.1), V(8.75, hb + .93, -32.7), V(5.85, hb + .93, -32.7)
r0, r1 = V(5.85, hb + 1.45, -31.9), V(8.75, hb + 1.45, -31.9)
vv = [roof.verts.new(p) for p in (a, b_, c_, d_, r0, r1)]
roof.faces.new((vv[0], vv[1], vv[5], vv[4])); roof.faces.new((vv[3], vv[4], vv[5], vv[2]))
roof.faces.new((vv[0], vv[4], vv[3])); roof.faces.new((vv[1], vv[2], vv[5]))
put(mesh_obj("roof", roof, M_ROOF, smooth=False), "shore")
box("window", V(6.75, hb + .5, -31.18), (.42, .32, .04), M_WIN, "shore")
box("door", V(7.9, hb + .38, -31.18), (.38, .72, .04), airy(material("door", (.06, .045, .04), .7)), "shore")


# ---- trees: a few white pine shapes and bare oaks, placed across the hill -------------------------------------------------
def pine_mesh(seed):
    """A snowy conifer: a straight trunk and many tiers of drooping branch clumps whose reach narrows to a spire, so the
    silhouette reads as a cone, but ragged, with sky showing between the tiers."""
    from mathutils import Matrix
    r = random.Random(seed)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=7, radius1=.03, radius2=.008, depth=1.0, matrix=Matrix.Translation((0, 0, .5)))
    n = 11 + r.randint(0, 3)
    for i in range(n):
        t = i / n
        y = .1 + t * .84 + r.uniform(-.012, .012)
        reach = (.33 * (1 - t) + .025) * (.85 + r.random() * .3)
        m = 5 + int((1 - t) * 4)
        a0 = r.uniform(0, 6.283)
        for k in range(m):
            ang = a0 + 6.283 * k / m + r.uniform(-.3, .3)
            L = reach * r.uniform(.7, 1.05)
            droop = r.uniform(.18, .35)
            c = Vector((math.cos(ang) * L * .5, math.sin(ang) * L * .5, y - L * droop * .5))
            rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(droop, 4, "Y")
            g = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1, matrix=Matrix.Translation(c) @ rot @ Matrix.Diagonal((L * .55, .028 + L * .22, .022 + L * .07, 1)))
            for v in g["verts"]:
                v.co += Vector((r.uniform(-1, 1), r.uniform(-1, 1), r.uniform(-.5, .5))) * (.006 + L * .04)
    bmesh.ops.create_cone(bm, cap_ends=True, segments=6, radius1=.025, radius2=.0, depth=.09, matrix=Matrix.Translation((0, 0, .97)))
    me = bpy.data.meshes.new(f"pine{seed}")
    bm.to_mesh(me); bm.free()
    me.materials.append(M_PINE)
    return me


def oak_mesh(seed):
    r = random.Random(seed)
    bm = bmesh.new()
    from mathutils import Matrix

    def limb(p, d, l, w, depth):
        q = p + d * l
        dd = q - p
        rot = dd.to_track_quat("Z", "Y").to_matrix().to_4x4()
        bmesh.ops.create_cone(bm, cap_ends=False, segments=5, radius1=w, radius2=w * .68, depth=dd.length,
                              matrix=Matrix.Translation((p + q) / 2) @ rot)
        if depth <= 0:
            return
        for i in range(2 if r.random() < .65 else 3):
            nd = (d + Vector((r.uniform(-.7, .7), r.uniform(-.7, .7), r.uniform(-.1, .5)))).normalized()
            limb(q, nd, l * (.66 + r.random() * .14), w * .66, depth - 1)

    limb(Vector((0, 0, 0)), Vector((0, 0, 1)), .3, .016, 6)
    me = bpy.data.meshes.new(f"oak{seed}")
    bm.to_mesh(me); bm.free()
    me.materials.append(M_BARK)
    return me


PINES = [pine_mesh(s) for s in range(8)]
OAKS = [oak_mesh(100 + s) for s in range(6)]


def plant(me, x, z, h, layer, name):
    o = bpy.data.objects.new(name, me)
    o.location = V(x, hill(x, z) - .05, z) if layer == "shore" else V(x, far(x, z) - .05, z)
    o.scale = (h * (.85 + rnd.random() * .3), h * (.85 + rnd.random() * .3), h)
    o.rotation_euler = (rnd.uniform(-.03, .03), rnd.uniform(-.03, .03), rnd.random() * 6.283)
    coll[layer].objects.link(o)
    return o


for i in range(300):     # bare oaks behind the pines: a soft purple band of twigs
    x, z = rnd.uniform(-78, 78), rnd.uniform(-36, -48)
    plant(rnd.choice(OAKS), x, z, 3.6 + rnd.random() * 2.2, "shore", f"oak{i}")
n = 0
while n < 900:
    x = rnd.uniform(-75, 75)
    z = rnd.uniform(-31.5, -46)
    if abs(x - 2) < 5.5 and z > -34.5 and rnd.random() < .9:
        continue
    if abs(x - 7.3) < 2.2 and z > -33.5:
        continue
    plant(rnd.choice(PINES), x, z, 2.4 + rnd.random() * 2.6, "shore", f"pine{n}")
    n += 1


# ---- the far ridge across the pond -----------------------------------------------------------------------------------------
def far(x, z):
    crest = -.4 + ridge(x, 1) * .8
    return crest - max(0, z + 60) * .5 + noise.noise(Vector((x * .3, z * .3, 5))) * .15


grid("ridge", -130, 130, -55, -70, .5, far, M_SNOW, "far")
for i in range(1400):
    x = rnd.uniform(-125, 125)
    z = rnd.uniform(-59, -66)
    plant(rnd.choice(PINES), x, z, .9 + rnd.random() * .9, "far", f"fpine{i}")


# ---- near: a white pine bough into the top left, snow on it; the edge of a drift at our feet -----------------------------------
def drift(x, z):
    """A soft, low swell of wind-blown snow in front of us: it rises out of the pond and settles back before our feet."""
    h = .24 * smooth(2.0, 3.8, z)     # a bank that runs on under our feet: no slope facing away from the sun
    h += .07 * noise.noise(Vector((x * .32, z * .32, 9))) * smooth(2.0, 3.8, z)
    return -1.996 + max(0., h)


def fade_back(m, z0, z1):
    """Fade a near-layer surface to transparent toward its far edge (three z0 -> z1), so it melts into the layer behind."""
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    surf = out.inputs["Surface"].links[0].from_socket
    tc = nt.nodes.new("ShaderNodeTexCoord"); sp = nt.nodes.new("ShaderNodeSeparateXYZ"); nt.links.new(tc.outputs["Object"], sp.inputs["Vector"])
    mr = nt.nodes.new("ShaderNodeMapRange"); nt.links.new(sp.outputs["Y"], mr.inputs["Value"])
    mr.inputs["From Min"].default_value, mr.inputs["From Max"].default_value = -z1, -z0      # Blender y = -three z
    tr = nt.nodes.new("ShaderNodeBsdfTransparent"); mx = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(mr.outputs["Result"], mx.inputs["Fac"]); nt.links.new(surf, mx.inputs[1]); nt.links.new(tr.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], out.inputs["Surface"])
    return m


grid("drift", -16, 16, 1.8, 20, .1, drift, fade_back(airy(ice_mat(False, "driftsnow")), 1.8, 2.9), "near")

# footprints from the beach out to where we stand: shallow dents, blue in their shade
M_PRINT = airy(material("prints", (.42, .46, .62), .8))
fp = bmesh.new()
for k in range(46):
    t = k / 46
    x = 1.5 + math.sin(t * 5) * .4 - t * 1.5 + (.12 if k % 2 else -.12)
    z = -29 + (1.5 + 29) * t
    g = bmesh.ops.create_circle(fp, cap_ends=True, segments=10, radius=1,
                                matrix=Matrix.Translation(V(x, -1.997, z)) @ Matrix.Diagonal((.07, .13, 1, 1)))
put(mesh_obj("footprints", fp, M_PRINT, smooth=False), "ice")

bm = bmesh.new()
from mathutils import Matrix
M_NEEDLE = airy(material("needles", (.02, .045, .035), .55))
M_TWIG = airy(snowy("twig", (.06, .045, .035), .8))
needles = bmesh.new()
snow_bm = bmesh.new()


def bough(p, ang, l, w, d):
    if d > 3:
        return
    q = p + Vector((math.cos(ang), 0, math.sin(ang))) * l + Vector((0, rnd.uniform(-.1, .1), 0))
    dd = q - p
    bmesh.ops.create_cone(bm, cap_ends=False, segments=6, radius1=w, radius2=w * .7, depth=dd.length,
                          matrix=Matrix.Translation((p + q) / 2) @ dd.to_track_quat("Z", "Y").to_matrix().to_4x4())
    steps = int(dd.length / .016)
    for k in range(steps):
        c = p + dd * (k / steps)
        for nn in range(7):     # white pine: needles in bunches of five, long and soft
            a = rnd.uniform(0, 6.283)
            dirn = (dd.normalized() * .55 + Vector((math.cos(a), math.sin(a) * .6, math.sin(a) - .35)).normalized()).normalized()
            ln = .16 + rnd.random() * .1
            e = c + dirn * ln
            bmesh.ops.create_cone(needles, cap_ends=False, segments=3, radius1=.0045, radius2=.001, depth=ln,
                                  matrix=Matrix.Translation((c + e) / 2) @ (e - c).to_track_quat("Z", "Y").to_matrix().to_4x4())
        if rnd.random() < .1:
            s = rnd.uniform(.03, .07)
            g = bmesh.ops.create_icosphere(snow_bm, subdivisions=2, radius=1,
                                           matrix=Matrix.Translation(c + Vector((0, 0, .05))) @ dd.to_track_quat("X", "Z").to_matrix().to_4x4() @ Matrix.Diagonal((s * 2.0, s * .9, s * .5, 1)))
            for v in g["verts"]:
                v.co += Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1))) * s * .18
    bough(q, ang + .5, l * .62, w * .6, d + 1)
    bough(q, ang - .45, l * .55, w * .55, d + 1)


bough(V(-6.5, 4.1, 1), -.3, 1.6, .05, 0)
put(mesh_obj("bough", bm, M_TWIG), "near")
put(mesh_obj("needles", needles, M_NEEDLE), "near")
put(mesh_obj("bough_snow", snow_bm, M_SNOW), "near")

# ---- light: the low sun behind the ridge, left of centre; a sky lit from the live sky's own colours ----------------------------
sun = bpy.data.lights.new("sun", "SUN")
sun.energy = 2.7
sun.color = (1, .72, .5)
sun.angle = math.radians(.6)
so = link(bpy.data.objects.new("sun", sun))
to_sun = V(-11, 17, -70).normalized()   # about 13 degrees up, left of centre behind the ridge
so.rotation_euler = (-to_sun).to_track_quat("-Z", "Y").to_euler()

wd = bpy.data.worlds.new("sky")
wd.use_nodes = True
sc.world = wd
nt = wd.node_tree
bg = nt.nodes["Background"]
bg.inputs["Strength"].default_value = 1.5
tc = nt.nodes.new("ShaderNodeTexCoord")
sep = nt.nodes.new("ShaderNodeSeparateXYZ"); nt.links.new(tc.outputs["Generated"], sep.inputs["Vector"])
ramp = nt.nodes.new("ShaderNodeValToRGB"); nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
# z of the direction: .5 = horizon, 1 = straight up (painted sky stops, horizon warm to cool blue overhead)
els = ramp.color_ramp.elements
def srgb(c): return tuple((v / 255) ** 2.2 for v in c) + (1,)
els[0].position, els[0].color = .5, srgb((250, 198, 150))
els[1].position, els[1].color = 1.0, srgb((54, 78, 120))
for pos, c in ((.52, (236, 170, 140)), (.58, (150, 140, 170))):
    e = els.new(pos); e.color = srgb(c)
nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])

# the ridge must not shadow the whole pond (the sun sits just above it in the painting)
for o in coll["far"].all_objects:
    o.visible_shadow = False


# ---- cameras and frames ----------------------------------------------------------------------------------------------------
cams = json.load(open(os.path.join(HERE, "walden_cams.json")))
frames = {}
for key in SETS:
    C = Vector(DWELL[key])
    fov = math.radians(cams[key]["fov"])
    X0 = Y0 = 1e9
    X1 = Y1 = -1e9
    for zl in LAYERS.values():
        for p in cams[key]["cams"]:
            D = p[2] - zl
            if D < .5:
                continue
            hh = D * math.tan(fov / 2) * MARGIN
            hw = hh * ASP[key]
            k = (C.z - ZR) / (C.z - zl)
            for x, y in ((p[0] - hw, p[1] - hh), (p[0] + hw, p[1] + hh)):
                X, Y = C.x + (x - C.x) * k, C.y + (y - C.y) * k
                X0, X1, Y0, Y1 = min(X0, X), max(X1, X), min(Y0, Y), max(Y1, Y)
    Wr, Hr = X1 - X0, Y1 - Y0
    res = (int(Wr * PX[key]) // 2 * 2, int(Hr * PX[key]) // 2 * 2)
    frames[key] = {"C": list(C), "zr": ZR, "rect": [X0, Y0, X1, Y1], "res": res}
json.dump(frames, open(os.path.join(HERE, "walden_frames.json"), "w"), indent=1) if set(SETS) == {"land", "port"} else None
print("FRAMES", frames)

for key in SETS:
    fr = frames[key]
    C = Vector(fr["C"])
    X0, Y0, X1, Y1 = fr["rect"]
    Wr, Hr = X1 - X0, Y1 - Y0
    Dr = C.z - ZR
    L = max(Wr, Hr)
    cd = bpy.data.cameras.new(f"cam_{key}")
    cd.sensor_fit = "AUTO"
    cd.sensor_width = 36
    cd.lens = 36 * Dr / L
    cd.shift_x = ((X0 + X1) / 2 - C.x) / L
    cd.shift_y = ((Y0 + Y1) / 2 - C.y) / L
    cd.clip_start, cd.clip_end = .1, 500
    co = link(bpy.data.objects.new(f"cam_{key}", cd))
    co.location = V(*C)
    co.rotation_euler = (math.pi / 2, 0, 0)    # looking down -z (three.js), no tilt: image plane parallel to every layer
    sc.camera = co
    sc.render.resolution_x, sc.render.resolution_y = fr["res"]
    for lay in LAYERS:
        if ONLY and lay not in ONLY:
            continue
        for k2, c in coll.items():
            for o in c.all_objects:
                o.visible_camera = (k2 == lay)
                if k2 == "shore":                # gaps between the shore pines threw bright sun fans across the ice; the pond lies in even light
                    o.visible_shadow = lay == "shore"
        sun.specular_factor = .25 if lay in ("ice", "near") else 1   # unbroken, the sun's path on the ice blazed; keep it a soft sheen
        sc.render.filepath = os.path.join(OUT, f"{key}_{lay}.png")
        bpy.ops.render.render(write_still=True)
        print("RENDERED", key, lay, fr["res"])

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "blend", "walden.blend"))
