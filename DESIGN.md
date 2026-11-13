# Portfolio design doc

Adds to `~/.claude/design.md`, never overrides it. Decisions and their history live in `STORYBOARD.md`.

## Scene craft: every painted scene

Approved on the opening scene (2026-11-04, "depth layers" on top of "grounded"). Apply to every scene in `airport.js`, `concord.js` and `painted/*.js`.

1. **Grounded.** Every object that stands on the ground sits on its own soft contact shadow: a footprint laid down in widening passes (`softShadow`), tight dark patches at wheels and feet, and a darker underside. No `ctx.filter` blur.
2. **Far layer pushed back.** A thin veil of the scene's own haze colour over the distant buildings, so the subject stands in front of them.
3. **Rim light.** Where a bright background sits behind a dark subject, the subject's top edges catch a thin warm rim, so its silhouette separates.
4. **Air in the middle.** Light from the scene's real sources falls through the air (faint shafts, low mist), drawn in front of the subject.
5. **A near layer.** Real objects that belong at that place, nearer than the subject (cones, a tug, a power unit at the airport), each on its own shadow and rim-lit, so the eye reads three depths.
6. Every light has a real source in the scene. Shadows fall away from it.

Rejected on the opening scene: hard mast-cast shadows with a lit flank ("floodlit"); realism moved onto our own wing ("our wing"). "Modelled form" (sheen, shaded engines, reflection in the wet concrete) was not picked but not rejected.

## Location plaques (built 2026-11-04)

- **Picked: the tavern sign.** A board hanging on two chains from an iron arm that comes off the right edge. It drops in on arrival (.3s, house curve), swings and settles (1.2s damped), and lifts out in .2s. Reduced motion: fade only. Bottom right, 64px up so it clears "Skip to projects"; on narrow screens it sits just above the chapter line.
- **One family:** same shape, same type (Spectral: name, tracked caps region, one line), the board's material carries the place.
  - Concord: navy, gilt letters, cream border, stars (also "Back at 11").
  - Boston: oxblood like Beacon Hill brick, gilt, anchors.
  - Doha: Qatar maroon with the white serrated band, brass arm and chains, the Arabic name.
  - The dunes: sun-bleached wood, burnt-in letters, rope from a weathered beam.
  - Wake Forest: black and old gold, jersey-stripe border, football laces.
  - Barcelona: glazed tile in a trencadis mosaic frame, blue letters, curled iron arm.
  - New York: black lacquer, chrome letters, an art deco sunburst, steel cable.
- **The third line** is from his own copy until he gives years (only Barcelona, fall 2024, is a date). The Concord street sign is gone.
- **Rejected:** cast bronze marker, 1775 broadside, bunting banner.
- Code: `#plq` CSS and `PLQ` (place, story window, name, region, line) in `projects.src.html`. The chain class is `.chn`: `.ch` is taken by the chapter lines.
