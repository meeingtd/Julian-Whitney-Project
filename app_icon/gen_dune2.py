import math, random
INK, BG, TEAL, AMB, LEAF = "#E8ECEC", "#0E1214", "#7CC0B6", "#D9A866", "#4E9A5B"
random.seed(11)
# Big Bang: bright core, thin rays, specks flying outward (upper right)
cx, cy = 392, 128
burst = f'<circle cx="{cx}" cy="{cy}" r="17" fill="{INK}"/>'
rays = ""
for i in range(18):
    a = math.radians(i*20 + random.randint(-5, 5)); r0 = 30; r1 = random.randint(60, 108)
    rays += f'<path d="M{cx+r0*math.cos(a):.1f} {cy+r0*math.sin(a):.1f} L{cx+r1*math.cos(a):.1f} {cy+r1*math.sin(a):.1f}"/>'
specks = ""
for i in range(26):
    a = math.radians(random.uniform(0, 360)); r = random.uniform(100, 175)
    x, y = cx + r*math.cos(a), cy + r*math.sin(a)
    if 14 < x < 498 and 14 < y < 250: specks += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{random.choice([2.5,3.5,4.5])}"/>'
# palm: grows from the sand on the left and its crown sits over the person
px, py = 322, 214
trunk = f'M90 442 C66 336 176 222 {px} {py}'
def frond(ex, ey, lift, wmax):
    """Pinnate palm frond: a drooping rib with a serrated leaflet edge on both sides."""
    cxp, cyp = px + (ex-px)*0.5, py + (ey-py)*0.5 - lift
    def P(t): return ((1-t)**2*px + 2*(1-t)*t*cxp + t*t*ex, (1-t)**2*py + 2*(1-t)*t*cyp + t*t*ey)
    def T(t):
        dx = 2*(1-t)*(cxp-px) + 2*t*(ex-cxp); dy = 2*(1-t)*(cyp-py) + 2*t*(ey-cyp); L = math.hypot(dx, dy); return dx/L, dy/L
    N = 10
    def edge(sd):
        pts = []
        for i in range(1, N+1):
            for k, (o, wf) in enumerate(((0.0, 1.0), (0.5, 0.22))):
                t = min(1, (i - 0.5 + o) / N) if k == 0 else min(1, (i + o - 0.5) / N)
                x, y = P(t); tx, ty = T(t); nx, ny = -ty, tx
                w = wmax * (math.sin(math.pi * min(1, t*1.05)) ** 0.7) * wf
                sw = wmax * 0.9 * wf
                pts.append((x + sd*nx*w + tx*sw, y + sd*ny*w + ty*sw))
        return pts
    up = edge(1); dn = edge(-1)[::-1]
    poly = [(px, py)] + up + [(ex, ey)] + dn
    return '<path d="M' + " L".join(f"{x:.1f} {y:.1f}" for x, y in poly) + 'Z"/>'
fr = "".join(frond(*t) for t in ((140, 322, 92, 15), (214, 340, 64, 14), (410, 340, 64, 14), (486, 318, 92, 15), (212, 176, 56, 12), (434, 176, 56, 12), (322, 142, 6, 11)))
crown = "".join(f'<circle cx="{px+dx}" cy="{py+dy}" r="{r}"/>' for dx, dy, r in ((-9, 9, 9), (7, 11, 9), (0, 20, 8)))
# person lying on their back, head right, near knee up, hands behind head
import os, bodies
body = bodies.get(os.environ.get('BODY', 'v0'))
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect width="512" height="512" fill="{BG}"/>
<path d="M0 300 C90 240 190 310 270 278 S430 246 512 290 V512 H0Z" fill="{TEAL}"/>
<path d="M0 392 C80 340 200 414 290 366 S440 352 512 390 V512 H0Z" fill="{AMB}"/>
<path d="{trunk}" fill="none" stroke="{AMB}" stroke-width="15" stroke-linecap="round"/>
<g fill="{LEAF}" stroke="{LEAF}" stroke-width="2" stroke-linejoin="round">{fr}</g><g fill="{AMB}">{crown}</g>
<g transform="translate(222 396) rotate(2) scale(1.12)">{body}</g>
</svg>'''
open("icon_dune.svg", "w").write(svg)
