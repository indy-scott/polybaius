# PolybAIus — Decision Log

Status of each decision: **OPEN** (needs Scott), **DECIDED**, or **DEFERRED**.

## D1. Rendering stack — OPEN

| Option | Pros | Cons |
|---|---|---|
| **A. Canvas 2D + glow (recommended)** | Zero deps, tiny, easy to tune, 60fps easily for vector art, full control of the neon look | 3D is faked (which is fine — Tempest webs are line art, not meshes) |
| B. Three.js (WebGL) | True 3D webs, postprocessing bloom out of the box | Heavier, steeper learning curve, glow tuning is shader work |
| C. Phaser 3 | Game framework: scenes, input, tweens | Big dep for what is fundamentally a vector renderer; Canvas 2D underneath anyway |

## D2. Art direction — DECIDED

**"Gibson Corridor" with Gibson Cyan as the default palette.**

- Playfield = a corridor between two Gibson monolith towers; the PCB cannon sits
  in the middle of the corridor.
- **Palette system:** Gibson Cyan default; the other samples (Toxic Terminal,
  Violet Flux) plus additional palettes selectable as optional selections
  (candidates: Amber Mainframe, Glacier ICE, Red Alert — final list TBD when
  the sample is extended).
- **Per-level tower variation:** each level reconfigures the towers — height
  profile, color scheme, and text content. Text must sound real: directory
  trees, file names, password strings, Linux system terms (systemd units,
  netstat tables, hex dumps, RSA key blocks, /var/log lines).

## D4. Controls — DECIDED

- **Mouse-driven:** an aiming target follows the mouse; **left click = fire**.
- **Secondary click (right click) = bomb** — screen-clearing style weapon.
  Starts each game with 3 bombs; more awarded at score milestones
  (threshold rule: see scoring decisions).

## D9. Player weapon placement — DECIDED

Cannon is stationary in the corridor center (between the towers); aiming is
done with the mouse-driven targeting reticle rather than rotating around a rim.

## D3. High-score persistence — DECIDED

**localStorage only.** Top 10 scores persist in the browser, works offline,
zero infra. (Revisit a shared homelab board only if Scott asks later.)

## D10. Scoring model — DECIDED

**Combo chains:** consecutive hits without a miss build a score multiplier.
A missed shot (shot expires without a kill) or a bug reaching the cannon
resets the chain. Base points per bug type still apply underneath.

## D11. Bomb awards — DECIDED

**Kill streaks:** a streak is consecutive kills with no missed shots and no
damage taken. Reaching a streak threshold awards a bomb; thresholds are
spaced so bombs are *mildly difficult* to earn (tune: first at ~15, then
escalating). Start each game with 3.

## D12. High score table format — DECIDED

**Arcade style:** top 10 table, 3-letter initials entry via keyboard, like
Tempest.

## D13. Extra lives — DECIDED

**Score intervals:** one extra life every 75,000 points, maximum 6 in reserve.

## D5. Audio — OPEN

- **A. WebAudio procedural synth (recommended)** — bleeps/hums generated in code,
  no asset files, very Tempest.
- B. Sampled audio files (retro SFX packs).
- C. Ship silent at first; add audio later.

## D6. Level structure — DECIDED (matches Tempest, adapted)

16 web shapes cycling with palette-band rotation; corrupted-trace dodge during
warp; random shapes after level 99. Adaptation: bomb is ammo-based (start 3,
milestone awards) instead of Tempest's per-level Superzapper recharge. Each
level also reconfigures the corridor towers (see D2).

## D7. Repository / tooling — DECIDED

Plain static site, no bundler, no framework. Git + Forgejo remote optional
(init6/homelab). Lint via `npx eslint` optional later; no CI needed until tests
exist.

## D8. Enemy visual design — OPEN (see samples/style-samples.html gallery)

- **A. Neon wireframe bugs** — articulated glowing line-art creatures (most
  Tempest-faithful).
- B. Solid membrane bugs with emissive outlines.
- C. Pixel/sprite bugs — clashes with the vector aesthetic; listed for completeness.
