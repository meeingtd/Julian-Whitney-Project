#!/usr/bin/env python3
"""Build the public projects page from projects.src.html.

    python3 portfolio/build.py
-> projects.html  artifact version: videos and stills inlined as data: URIs (an artifact cannot load other files)
-> index.html     GitHub Pages version: videos and stills in media/
"""
import base64, re, shutil
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEMOS = HERE.parent / "prep/projects/demos/out"
PUBLIC = ["hexcel", "scoreboard", "homebase", "usage"]  # only cleared projects
PRIVATE = []  # artifact-only projects (wrap their section in PRIVATE comment markers)

src = (HERE / "projects.src.html").read_text()
# Close-up panes are separate source files; both outputs carry them inline.
panes = "\n".join(f"<script>\n{p.read_text()}</script>" for p in sorted((HERE / "panes").glob("*/*.js")))
src = src.replace("<!--PANES-->", panes)
AIR = "<script>\n" + (HERE / "airport.js").read_text() + "</script>"
src = src.replace("<!--AIRPORT-->", AIR)
src = src.replace("<!--EARTH-->", "<script>\n" + (HERE / "earth_data.js").read_text() + "</script>")
# The intro desk scene is an ES module (three.js addons: post-processing, rounded boxes), so it brings its own import map.
DESK = ('<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js",'
        '"three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/"}}</script>\n'
        '<script type="module">\n' + (HERE / "desk.js").read_text() + "</script>")
src = src.replace("<!--DESK-->", DESK)
# The solar system hub: also an ES module layer; it shares the desk's import map, so it must come after it.
src = src.replace("<!--SOLAR-->", '<script type="module">\n' + (HERE / "flight.js").read_text() + "</script>")
src = src.replace("<!--CONCORD-->", "")  # the Minute Man statue scene was retired 2026-11-06 (Walden Pond replaces it); concord.js kept for reference
src = src.replace("<!--PAINTED-->", "\n".join(f"<script>\n{p.read_text()}</script>" for p in sorted((HERE / "painted").glob("*.js"))))
(HERE / "media").mkdir(exist_ok=True)
for n in PUBLIC:
    shutil.copy(DEMOS / f"{n}.mp4", HERE / "media" / f"{n}.mp4")
def data_uri(rel, mime):
    path = HERE / "media" / rel
    if not path.exists():
        path = DEMOS / rel
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()

def document(page):
    end = page.index("</style>") + len("</style>")
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            + page[:end] + "\n</head><body>\n" + page[end:] + "\n</body></html>\n")

dev = src.replace("<!--PROGRESS-->", '<script src="progress.js"></script>').replace(AIR, '<script src="airport.js"></script>', 1)
src = src.replace("<!--PROGRESS-->", "<script>\n" + (HERE / "progress.js").read_text() + "</script>")
inline = re.sub(r'src="media/(\w+\.mp4)"', lambda m: f'src="{data_uri(m.group(1), "video/mp4")}"', src)
inline = re.sub(r'(src|poster)="media/((?:stills|wfu)/[\w-]+\.jpg)"', lambda m: f'{m.group(1)}="{data_uri(m.group(2), "image/jpeg")}"', inline)
inline = re.sub(r'"media/((?:plates)/[\w/-]+\.webp)"', lambda m: '"' + data_uri(m.group(1), "image/webp") + '"', inline)
inline = re.sub(r'"assets/([\w-]+\.glb)"', lambda m: '"data:model/gltf-binary;base64,' + base64.b64encode((HERE / "assets" / m.group(1)).read_bytes()).decode() + '"', inline)
inline = re.sub(r'src="media/(wfu/[\w-]+\.png)"', lambda m: f'src="{data_uri(m.group(1), "image/png")}"', inline)
inline = inline.replace("<!--PRIVATE-->", "").replace("<!--/PRIVATE-->", "")
(HERE / "projects.html").write_text(document(inline))
# dev page: the same as projects.html but progress.js and airport.js stay separate files, so its variants can be swapped without a build
(HERE / "projects.dev.html").write_text(document(dev.replace("<!--PRIVATE-->", "").replace("<!--/PRIVATE-->", "")))
src = re.sub(r"<!--PRIVATE-->.*?<!--/PRIVATE-->\n?", "", src, flags=re.S)
(HERE / "index.html").write_text(document(src))
print(f"projects.html (+{', '.join(PRIVATE)}) {len(inline) / 1e6:.1f} MB, index.html + media/ ({', '.join(PUBLIC)})")
