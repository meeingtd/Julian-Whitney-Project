#!/usr/bin/env python3
"""Build the temporary recruiter site from projects.src.html.

    python3 portfolio/build_temp.py
-> temp/index.html + temp/media/

Same globe and project drum as the main page, without the story: no chapters, no Wake Forest
or name sequence, no Skip button. The page opens on the projects view and scroll only moves
through the drum. The main source and build.py are unchanged.
"""
import re, shutil
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "temp"

src = (HERE / "projects.src.html").read_text()
panes = "\n".join(f"<script>\n{p.read_text()}</script>" for p in sorted((HERE / "panes").glob("*/*.js")))
src = src.replace("<!--PANES-->", panes)
src = re.sub(r"<!--PRIVATE-->.*?<!--/PRIVATE-->\n?", "", src, flags=re.S)


def swap(text, old, new):
    assert text.count(old) == 1, f"expected one match for: {old[:70]!r} (found {text.count(old)})"
    return text.replace(old, new)


# 1. Story elements stay in the DOM so the scene code still finds them, but never show.
src = """<style>/* temp site: no story, no name sequence, no Wake Forest, no skip */
#story,#skip,#bigname,#wfu,#morph,#cue{display:none!important}
#track{height:440vh}
</style>
""" + src

# 2. Start on the projects view (the state Skip to projects used to reach).
src = swap(src, "let p=0,time=0,gs=0,shown=null;",
           "let p=STORY+.2*(1-STORY),time=0,gs=0,shown=null;")

# 3. Scroll covers only the drum: scroll 0 is the projects view, the bottom is the end of the drum.
src = swap(src, "const goal=Math.min(1,scrollY/scrollMax());",
           "const goal=PANELS_AT+(1-PANELS_AT)*Math.min(1,scrollY/scrollMax());")
src = swap(src, "window.toProjects=()=>{scrollTo(0,scrollMax()*PANELS_AT);",
           "window.toProjects=()=>{scrollTo(0,0);")

# 4. Let's talk goes to the alumni address (set in projects.src.html); LinkedIn already points at the profile.
assert src.count('href="mailto:julianwhitney@alumni.wfu.edu?subject=Hello%20Julian"') == 1

# 5. Title for the temporary site.
src = swap(src, "<title>Julian Whitney Projects</title>", "<title>Julian Whitney: Projects</title>")

# Media goes next to the page, as in the GitHub Pages build.
OUT.mkdir(exist_ok=True)
shutil.rmtree(OUT / "media", ignore_errors=True)
shutil.copytree(HERE / "media", OUT / "media")
end = src.index("</style>") + len("</style>")
page = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        + src[:end] + "\n</head><body>\n" + src[end:] + "\n</body></html>\n")
(OUT / "index.html").write_text(page)
print(f"temp/index.html {len(src) / 1e3:.0f} KB, media copied")
