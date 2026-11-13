"""The desk lamp: a matte black architect lamp (original design), modelled at the desk scene's exact joint points.
Points mirror desk.js (base, elbow, head, BULB, and the aim at the globe centre GC). If those change there, change them here.
Parts: weighted base with a rocker switch, a turret and knuckle, two arms of twin rods with coil springs, knuckles with steel nuts,
a neck to a spun steel shade (rolled rim, white enamel inside, socket), and the cord lying on the desk to the wall.
The bulb, the light, the beam and the dust stay in desk.js. Body paint wear is baked into textures.
Run: /Applications/Blender.app/Contents/MacOS/Blender -b -P blender/src/lamp.py
"""
import sys, os, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
import bpy
from mathutils import Vector
from export import *

reset()

# --- the scene's points (three.js coordinates, from desk.js) -------------------------------------
B = V(-1.55, 0, .05)          # base centre on the desk
E = V(-1.7, 1.0, .5)          # elbow
H = V(-1.14, 1.55, 1.06)      # head knuckle
BULB = V(-1.0, 1.42, 1.12)
GC = V(0, .0112 + .0336 * 6 - .012 + .55 + .004, 0)   # globe centre: plate + 6 bricks - cradle sink + radius
AIM = GC + V(.05, -.1, 0)
DIR = (AIM - BULB).normalized()      # where the shade points
UP = Vector((0, 0, 1))

# --- materials -----------------------------------------------------------------------------------
paint = material("lamp_paint", (.018, .018, .02), .45, 0)
steel = material("lamp_steel", (.42, .42, .44), .34, 1)
enamel = material("lamp_enamel", (.93, .9, .85), .32, 0)
bakelite = material("lamp_bakelite", (.04, .03, .025), .38, 0)
cord = material("lamp_cord", (.012, .012, .013), .62, 0)

body, metal = [], []

# --- base: a weighted cast disc, a hub, a turret ----------------------------------------------------
R0, R1, HB = mm(64), mm(58), mm(15)
bv = mm(3)
prof = [(0, 0), (R0 - mm(1), 0), (R0, mm(1)), (R0, mm(5))]
for i in range(1, 7):
    t = math.pi / 2 * i / 6
    prof.append((R0 - (R0 - R1) * math.sin(t), mm(5) + (HB - mm(5)) * math.sin(t)))
prof += [(mm(26), HB), (mm(24), HB + mm(4)), (mm(22), HB + mm(6)), (0, HB + mm(6))]
body.append(lathe("base", prof, paint, steps=128, at=B))
TT = B + UP * (HB + mm(6))
body.append(cylinder("turret", TT, TT + UP * mm(26), mm(10), paint))
# rocker switch on the front of the base
sw_at = B + V(0, 0, 1) * mm(40)
sw = cylinder("switch", sw_at + UP * (HB - mm(4)), sw_at + UP * (HB + mm(4)), mm(6), bakelite, segs=24, bevel=mm(2))

# --- arms ---------------------------------------------------------------------------------------
P0 = TT + UP * mm(30)          # lower knuckle
d1, d2 = (E - P0), (H - E)
ax1 = d1.cross(UP).normalized()   # the axle of each knuckle: across the arm plane
ax2 = d2.cross(UP).normalized()
n1 = ax1.cross(d1).normalized()
n2 = ax2.cross(d2).normalized()


def knuckle(name, at, ax, r=mm(9), half=mm(15)):
    body.append(cylinder(name, at - ax * half, at + ax * half, r, paint, bevel=mm(2)))
    for s in (-1, 1):   # steel nuts and washers on both ends
        metal.append(cylinder(name + f"_washer{s}", at + ax * s * half, at + ax * s * (half + mm(1)), r * .95, steel, segs=32, bevel=mm(.4)))
        metal.append(cylinder(name + f"_nut{s}", at + ax * s * (half + mm(1)), at + ax * s * (half + mm(5)), mm(5), steel, segs=6, bevel=mm(.6)))
    # a tension knob on one side
    (cylinder(name + "_knob", at + ax * (half + mm(5)), at + ax * (half + mm(12)), mm(13), bakelite, segs=48, bevel=mm(2)))


def arm(name, a, b, n, ax, spring_side=1):
    d = (b - a).normalized()
    a2, b2 = a + d * mm(8), b - d * mm(8)
    for s in (-1, 1):   # twin rods
        body.append(cylinder(f"{name}_rod{s}", a2 + n * s * mm(7), b2 + n * s * mm(7), mm(3.2), paint, segs=20, bevel=mm(1)))
    # a coil spring beside the rods, held by a thin link
    off = ax * spring_side * mm(13)
    s0 = a + d * mm(30) + off
    s1 = a + d * ((b - a).length * .5) + off
    metal.append(helix(f"{name}_spring", s0, s1, mm(5), mm(.75), mm(1.7), steel))
    metal.append(cylinder(f"{name}_link", s1, b - d * mm(30) + off, mm(1), steel, segs=10, bevel=mm(.3)))
    for p in (s0, b - d * mm(30) + off):
        metal.append(cylinder(f"{name}_pin", p - off, p, mm(1.6), steel, segs=12, bevel=mm(.4)))


knuckle("k_base", P0, ax1)
knuckle("k_elbow", E, ax1)
knuckle("k_head", H, ax2, r=mm(8), half=mm(12))
arm("lower", P0, E, n1, ax1, 1)
arm("upper", E, H, n2, ax2, -1)

# --- shade: spun steel, rolled rim, enamel inside -------------------------------------------------
BACK = -DIR        # the shade's local axis, from the bulb toward its back
F = BULB           # profile heights are measured from the bulb along BACK
outer = [(mm(55.6), mm(-29)), (mm(54), mm(-27)), (mm(17), mm(26)), (mm(16.5), mm(30)), (mm(16), mm(36))]
for i in range(1, 9):
    t = math.pi / 2 * i / 8
    outer.append((mm(16) * math.cos(t), mm(36) + mm(14) * math.sin(t)))
body.append(lathe("shade", outer, paint, steps=128, at=F, axis=BACK))
inner = [(mm(53.2), mm(-27.5)), (mm(16.2), mm(25.5)), (mm(15.6), mm(30)), (0, mm(30))]
lathe("shade_inner", inner, enamel, steps=128, at=F, axis=BACK, outward=False)
# rolled rim: a thin torus at the opening
rim = [(mm(54.6) + mm(1.6) * math.cos(2 * math.pi * i / 16), mm(-28.4) + mm(1.6) * math.sin(2 * math.pi * i / 16)) for i in range(17)]
body.append(lathe("shade_rim", rim, paint, steps=128, at=F, axis=BACK))
# socket for the bulb, and the neck from the head knuckle to the shade's back
cylinder("socket", F + BACK * mm(4), F + BACK * mm(29), mm(10), bakelite, segs=40, bevel=mm(1.5))
SB = F + BACK * mm(49)
body.append(cylinder("neck", H, SB, mm(4.5), paint, segs=20, bevel=mm(1)))
body.append(cylinder("neck_collar", SB - BACK * mm(2), SB + BACK * mm(4), mm(7), paint, segs=32, bevel=mm(1.5)))

# --- the cord: out of the back of the base, a loose curve across the desk, off the left edge (to the wall socket) ---
cy = mm(2.6)
cpts = [B + V(0, 0, -1) * mm(50) + UP * mm(4), V(-1.62, 0, -.26), V(-1.85, 0, -.36), V(-2.2, 0, -.22), V(-2.65, 0, -.38), V(-3.3, 0, -.3)]
cpts = [p if i == 0 else p + UP * cy for i, p in enumerate(cpts)]
tube("cord", cpts, cy, cord)
metal.append(cylinder("grommet", B + V(0, 0, -1) * mm(54) + UP * mm(4), B + V(0, 0, -1) * mm(62) + UP * mm(4), mm(4.2), bakelite, segs=24, bevel=mm(1)))

# --- join by material, bake the paint's wear ------------------------------------------------------
lampbody = join("lamp_body", [o for o in body if o])
lampsteel = join("lamp_steel", [o for o in metal if o and o.data.materials[0] == steel])
for o in bpy.context.scene.objects:
    if o.type == "CURVE":
        bpy.ops.object.select_all(action="DESELECT"); o.select_set(True); bpy.context.view_layer.objects.active = o
        bpy.ops.object.convert(target="MESH")
for o in bpy.context.scene.objects:
    if o.type == "MESH":
        o.data.polygons.foreach_set("use_smooth", [True] * len(o.data.polygons))

# keep the knob/switch/socket (bakelite) on their own small mesh
bk = [o for o in bpy.context.scene.objects if o.type == "MESH" and o.data.materials and o.data.materials[0] == bakelite]
if len(bk) > 1:
    join("lamp_bakelite", bk)

# paint: near-black powder coat, smudged roughness, bare steel only on the sharpest edges
nt = paint.node_tree
geo = nt.nodes.new("ShaderNodeNewGeometry")
ao = nt.nodes.new("ShaderNodeAmbientOcclusion"); ao.inside = True; ao.only_local = True; ao.samples = 16
ao.inputs["Distance"].default_value = mm(2.5)
edge = nt.nodes.new("ShaderNodeMapRange")   # inside-AO is low on sharp convex edges
nt.links.new(ao.outputs["AO"], edge.inputs["Value"])
edge.inputs["From Min"].default_value, edge.inputs["From Max"].default_value = .55, .8
edge.inputs["To Min"].default_value, edge.inputs["To Max"].default_value = 1, 0
tc = nt.nodes.new("ShaderNodeTexCoord")
nz = nt.nodes.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 220; nz.inputs["Detail"].default_value = 6
nt.links.new(tc.outputs["Object"], nz.inputs["Vector"])
smudge = nt.nodes.new("ShaderNodeTexNoise"); smudge.inputs["Scale"].default_value = 26; smudge.inputs["Detail"].default_value = 3
nt.links.new(tc.outputs["Object"], smudge.inputs["Vector"])
wear = nt.nodes.new("ShaderNodeMath"); wear.operation = "MULTIPLY"
nt.links.new(edge.outputs["Result"], wear.inputs[0]); nt.links.new(nz.outputs["Fac"], wear.inputs[1])
wearc = nt.nodes.new("ShaderNodeMapRange"); nt.links.new(wear.outputs["Value"], wearc.inputs["Value"])
wearc.inputs["From Min"].default_value, wearc.inputs["From Max"].default_value = .32, .5
col = nt.nodes.new("ShaderNodeMix"); col.data_type = "RGBA"
nt.links.new(wearc.outputs["Result"], col.inputs["Factor"])
col.inputs["A"].default_value = (.018, .018, .02, 1); col.inputs["B"].default_value = (.32, .31, .3, 1)
rough = nt.nodes.new("ShaderNodeMapRange"); nt.links.new(smudge.outputs["Fac"], rough.inputs["Value"])
rough.inputs["From Min"].default_value, rough.inputs["From Max"].default_value = .35, .7
rough.inputs["To Min"].default_value, rough.inputs["To Max"].default_value = .36, .58
roughw = nt.nodes.new("ShaderNodeMix"); roughw.data_type = "FLOAT"
nt.links.new(wearc.outputs["Result"], roughw.inputs["Factor"]); nt.links.new(rough.outputs["Result"], roughw.inputs["A"]); roughw.inputs["B"].default_value = .28
bake_maps(lampbody, 1024, col.outputs["Result"], roughw.outputs["Result"], wearc.outputs["Result"], "lamp_body")

# --- preview, save, export ------------------------------------------------------------------------
mid = (B + BULB) / 2 + UP * mm(20)
finish("lamp", cam_from=mid + V(1.9, .35, 3.6), cam_to=mid, lens=50,
       lights=[(BULB + V(1.2, .6, 1.6), 40, (1, .78, .55), .6), (mid + V(-1.5, 1.5, -1.0), 10, (.6, .7, 1), 1.0)])
