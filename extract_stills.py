#!/usr/bin/env python3
"""Grab stills from the demo videos for the projects page's 3D panels.

    .venv/bin/python portfolio/extract_stills.py
-> media/stills/<name>-<1|2|3>.jpg  (uses Chrome for H.264; ffmpeg is not installed)
"""
import base64, functools, http.server, threading
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE / "media" / "stills"
NAMES = ["hexcel", "scoreboard", "homebase", "usage"]
FRACTIONS = {"hexcel": [0.45, 0.7, 0.92], "scoreboard": [0.3, 0.6, 0.9], "homebase": [0.6, 0.78, 0.95], "usage": [0.25, 0.55, 0.9]}

# Loaded as a blob: the throwaway server has no Range support, so it cannot seek a plain src.
GRAB = """async ([name, fractions]) => {
  const blob = await (await fetch(`/media/${name}.mp4`)).blob();
  const v = document.createElement('video');
  v.muted = true; v.src = URL.createObjectURL(blob);
  await new Promise(r => v.addEventListener('loadeddata', r, {once: true}));
  const c = document.createElement('canvas');
  c.width = 960; c.height = 600;
  const out = [];
  for (const f of fractions) {
    v.currentTime = v.duration * f;
    await new Promise(r => v.addEventListener('seeked', r, {once: true}));
    c.getContext('2d').drawImage(v, 0, 0, 960, 600);
    out.push(c.toDataURL('image/jpeg', 0.72));
  }
  return out;
}"""

OUT.mkdir(parents=True, exist_ok=True)
# Served over http because a file:// video taints the canvas.
server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(HERE)))
threading.Thread(target=server.serve_forever, daemon=True).start()
with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page()
    page.goto(f"http://127.0.0.1:{server.server_port}/index.html")
    for n in NAMES:
        for i, data in enumerate(page.evaluate(GRAB, [n, FRACTIONS[n]]), 1):
            (OUT / f"{n}-{i}.jpg").write_bytes(base64.b64decode(data.split(",", 1)[1]))
    browser.close()
server.shutdown()
print(sorted((p.name, p.stat().st_size // 1024) for p in OUT.glob("*.jpg")))
