# PolybAIus — Decision Log

Status of each decision: **OPEN** (needs Scott), **DECIDED**, or **DEFERRED**.

## D1. Rendering stack — OPEN

| Option | Pros | Cons |
|---|---|---|
| **A. Canvas 2D + glow (recommended)** | Zero deps, tiny, easy to tune, 60fps easily for vector art, full control of the neon look | 3D is faked (which is fine — Tempest webs are line art, not meshes) |
| B. Three.js (WebGL) | True 3D webs, postprocessing bloom out of the box | Heavier, steeper learning curve, glow tuning is shader work |
| C. Phaser 3 | Game framework: scenes, input, tweens | Big dep for what is fundamentally a vector renderer; Canvas 2D underneath anyway |

## D2. Art direction — OPEN (see samples/style-samples.html)

- **A. "Gibson Corridor"** — web rendered as glowing circuit traces over the
  movie's monolith-city void, text-textured towers in the background. Most
  faithful to the screenshots.
- **B. "Pure Vector"** — pitch black + web + HUD only, closest to arcade Tempest
  with the Hackers palette. Cleanest readability.
- **C. "Full Gibson"** — A plus reflective floor, anamorphic flares, dense
  background parallax. Most cinematic, highest visual-noise risk.

Palette per sample panel in the sample page.

## D3. High-score persistence — OPEN

- **A. localStorage only (recommended)** — works offline, zero infra, matches
  "fully in browser" goal.
- B. localStorage + optional tiny server later (Forgejo-hosted homelab endpoint)
  for a shared board — adds infra dependency.

## D4. Controls — OPEN

- **A. Keyboard only (recommended)** — ←/→ or A/D move, Space fire, Shift/E
  PANIC.exe, Enter start. Simple, faithful.
- B. Keyboard + mouse (pointer position = rim position, click = fire) —
  spinner-like feel.
- C. Both + touch for mobile.

## D5. Audio — OPEN

- **A. WebAudio procedural synth (recommended)** — bleeps/hums generated in code,
  no asset files, very Tempest.
- B. Sampled audio files (retro SFX packs).
- C. Ship silent at first; add audio later.

## D6. Level structure — DECIDED (matches Tempest)

16 web shapes cycling with palette-band rotation; corrupted-trace dodge during
warp; PANIC.exe recharges each level. Random shapes after level 99.

## D7. Repository / tooling — DECIDED

Plain static site, no bundler, no framework. Git + Forgejo remote optional
(init6/homelab). Lint via `npx eslint` optional later; no CI needed until tests
exist.

## D8. Enemy visual design — OPEN (see samples/style-samples.html gallery)

- **A. Neon wireframe bugs** — articulated glowing line-art creatures (most
  Tempest-faithful).
- B. Solid membrane bugs with emissive outlines.
- C. Pixel/sprite bugs — clashes with the vector aesthetic; listed for completeness.
