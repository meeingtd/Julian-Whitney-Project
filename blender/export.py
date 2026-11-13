"""Shared helpers for the portfolio's Blender scripts.

Run a script headless:  /Applications/Blender.app/Contents/MacOS/Blender -b -P blender/src/<asset>.py
Units: Blender scenes here are in SITE units (1 unit = 286 mm, the desk's Lego pitch: 8 mm = 0.028).
Write real sizes with mm(), positions with V(x, y, z) in three.js coordinates (Y up); V() turns them into Blender's Z-up.
Colour: the Standard view transform, so colours stay true and three.js does the tone mapping (ACES) on the site.
Each script ends with finish(name): saves blend/<name>.blend, renders renders/<name>/preview.png, exports out/<name>.glb.
Then compress for the site:  npx -y @gltf-transform/cli optimize blender/out/<name>.glb assets/<name>.glb --compress meshopt --texture-compress webp --simplify false --join false
"""
import bpy, bmesh, math, os
from mathutils import Vector, Matrix

ROOT = os.path.dirname(os.path.abspath(__file__))
UNIT_MM = 286.0


def mm(v):
    return v / UNIT_MM


def V(x, y, z):
    """three.js (x, y up, z toward camera) -> Blender (x, y back, z up)."""
    return Vector((x, -z, y))


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.view_settings.view_transform = "Standard"
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    return sc


def material(name, color, rough=.5, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    return m


def link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def mesh_obj(name, bm, mat=None, smooth=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    o = link(bpy.data.objects.new(name, me))
    if mat:
        o.data.materials.append(mat)
    return o


def frame(axis):
    """A rotation matrix whose local Z points along axis."""
    z = axis.normalized()
    t = Vector((0, 0, 1)) if abs(z.z) < .95 else Vector((1, 0, 0))
    x = t.cross(z).normalized()
    y = z.cross(x)
    return Matrix((x, y, z)).transposed()


def lathe(name, prof, mat, steps=96, at=Vector(), axis=Vector((0, 0, 1)), cap=False, outward=True):
    """Spin a profile [(radius, height), ...] around an axis. outward picks which way the faces look."""
    bm = bmesh.new()
    rings = []
    for i in range(steps):
        a = 2 * math.pi * i / steps
        rings.append([bm.verts.new((r * math.cos(a), r * math.sin(a), h)) for r, h in prof])
    for i in range(steps):
        A, B = rings[i], rings[(i + 1) % steps]
        for j in range(len(prof) - 1):
            if prof[j][0] < 1e-6 and prof[j + 1][0] < 1e-6:
                continue
            bm.faces.new((A[j], B[j], B[j + 1], A[j + 1]))
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-7)
    bm.normal_update()
    for f in bm.faces:
        c = f.calc_center_median()
        radial = Vector((c.x, c.y, 0))
        if radial.length > 1e-6 and (f.normal.dot(radial) > 0) != outward:
            f.normal_flip()
    m = Matrix.Translation(at) @ frame(axis).to_4x4()
    bmesh.ops.transform(bm, matrix=m, verts=bm.verts)
    return mesh_obj(name, bm, mat)


def cylinder(name, a, b, r, mat, segs=32, bevel=None):
    """A closed, edge-rounded cylinder from point a to point b."""
    d = b - a
    h = d.length
    bv = min(bevel if bevel is not None else r * .25, h / 2.2, r * .9)
    k = 4
    prof = [(0, 0)]
    for i in range(k + 1):
        t = math.pi / 2 * i / k
        prof.append((r - bv + bv * math.sin(t), bv - bv * math.cos(t)))
    for i in range(k + 1):
        t = math.pi / 2 * i / k
        prof.append((r - bv + bv * math.cos(t), h - bv + bv * math.sin(t)))
    prof.append((0, h))
    return lathe(name, prof, mat, steps=segs, at=a, axis=d)


def helix(name, a, b, coil_r, wire_r, pitch, mat, per_turn=8):
    """A coil spring from a to b."""
    d = b - a
    L = d.length
    turns = L / pitch
    n = int(turns * per_turn)
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = wire_r
    cu.bevel_resolution = 0
    sp = cu.splines.new("POLY")
    sp.points.add(n)
    F = frame(d)
    for i in range(n + 1):
        t = i / n
        ang = 2 * math.pi * turns * t
        p = a + F @ Vector((coil_r * math.cos(ang), coil_r * math.sin(ang), L * t))
        sp.points[i].co = (*p, 1)
    o = link(bpy.data.objects.new(name, cu))
    o.data.materials.append(mat)
    return o


def tube(name, pts, r, mat):
    """A smooth cord through points (Blender coords)."""
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = r
    cu.bevel_resolution = 3
    cu.resolution_u = 16
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    o = link(bpy.data.objects.new(name, cu))
    o.data.materials.append(mat)
    return o


def join(name, objs):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.convert(target="MESH")
    bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active
    o.name = name
    o.data.name = name
    return o


def bake_maps(obj, size, color_node, rough_node, metal_node, name):
    """Bake procedural colour / roughness / metal node outputs of obj's single material into images, then rewire the material
    to read them (base colour image, and one image with roughness in G and metal in B, which the glTF exporter packs as is)."""
    sc = bpy.context.scene
    sc.cycles.samples = 16
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=.01)
    bpy.ops.object.mode_set(mode="OBJECT")
    m = obj.data.materials[0]
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    bsdf = nt.nodes["Principled BSDF"]
    emit = nt.nodes.new("ShaderNodeEmission")
    imgs = {}
    for key, sock in (("col", color_node), ("orm", None)):
        img = bpy.data.images.new(f"{name}_{key}", size, size, alpha=False)
        img.colorspace_settings.name = "sRGB" if key == "col" else "Non-Color"
        node = nt.nodes.new("ShaderNodeTexImage")
        node.image = img
        nt.nodes.active = node
        if key == "col":
            nt.links.new(sock, emit.inputs["Color"])
        else:
            comb = nt.nodes.new("ShaderNodeCombineColor")
            comb.inputs["Red"].default_value = 1.0
            nt.links.new(rough_node, comb.inputs["Green"])
            nt.links.new(metal_node, comb.inputs["Blue"])
            nt.links.new(comb.outputs["Color"], emit.inputs["Color"])
        nt.links.new(emit.outputs["Emission"], out.inputs["Surface"])
        bpy.ops.object.bake(type="EMIT", margin=8)
        img.filepath_raw = os.path.join(ROOT, "out", f"{img.name}.png")
        img.file_format = "PNG"
        img.save()
        imgs[key] = node
    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    nt.links.new(imgs["col"].outputs["Color"], bsdf.inputs["Base Color"])
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    nt.links.new(imgs["orm"].outputs["Color"], sep.inputs["Color"])
    nt.links.new(sep.outputs["Green"], bsdf.inputs["Roughness"])
    nt.links.new(sep.outputs["Blue"], bsdf.inputs["Metallic"])


def finish(name, cam_from, cam_to, lens=50, res=(900, 900), samples=64, lights=()):
    """Save the .blend, render a preview, export the GLB (meshes only: lights and cameras stay in the site's code)."""
    for d in ("blend", "out", f"renders/{name}"):
        os.makedirs(os.path.join(ROOT, d), exist_ok=True)
    sc = bpy.context.scene
    meshes = [o for o in sc.objects if o.type == "MESH"]
    # preview stage: a dim room, a warm key, the camera
    w = bpy.data.worlds.new("preview")
    w.use_nodes = True
    w.node_tree.nodes["Background"].inputs["Color"].default_value = (.012, .013, .02, 1)
    sc.world = w
    tmp = []
    for loc, energy, col, size in lights:
        L = bpy.data.lights.new("key", "AREA")
        L.energy, L.color, L.size = energy, col, size
        o = link(bpy.data.objects.new("key", L))
        o.location = loc
        o.rotation_euler = (Vector((0, 0, 0)) - loc).to_track_quat("-Z", "Y").to_euler()
        tmp.append(o)
    c = bpy.data.cameras.new("cam")
    c.lens = lens
    co = link(bpy.data.objects.new("cam", c))
    co.location = cam_from
    co.rotation_euler = (cam_to - cam_from).to_track_quat("-Z", "Y").to_euler()
    sc.camera = co
    sc.cycles.samples = samples
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.filepath = os.path.join(ROOT, "renders", name, "preview.png")
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "blend", f"{name}.blend"))
    bpy.ops.render.render(write_still=True)
    bpy.ops.object.select_all(action="DESELECT")
    for o in meshes:
        o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(ROOT, "out", f"{name}.glb"), export_format="GLB", use_selection=True,
                              export_apply=True, export_cameras=False, export_lights=False, export_yup=True)
    print("FINISHED", name, [o.name for o in meshes])
