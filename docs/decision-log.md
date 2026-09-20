# PolybAIus — Decision Log

Status of each decision: **OPEN** (needs Scott), **DECIDED**, or **DEFERRED**.

## D1. Rendering stack — DECIDED

**"Lightweight 3D": Canvas 2D with manual one-point perspective projection
(2.5D).** Flat emissive neon style is kept; depth comes from projected
geometry — towers receding to a vanishing point, scale-by-distance, PCB-trace
floor in perspective. No WebGL/Three.js.

## D5. Audio — DECIDED

**WebAudio procedural synth.** All SFX generated in code (laser zap, hit,
bomb, breach hum), no audio assets.

## D14. Firing model — DECIDED

**Laser bolts** — fast, elongated, glowing projectiles (not Tempest's slow
dots). Cannon translates side-to-side along the corridor mouth, mouse-driven.

## D15. Power-ups — DECIDED

**Code patches** — small floppy-disk icons that float down the corridor toward
the cannon. Collected by shooting them or by letting them arrive at the cannon
(no penalty for not shooting them). Abilities vary per patch:

- **SLOW** — throttles virus flow (all bugs slowed ~50% for a duration)
- **RAPID** — triple-shot spread for a duration
- **SHIELD** — absorbs the next breach (one-time)
- **+BOMB** — one extra bomb

Patch type is shown by color + label on the disk.

## D16. Breach rule & ramp — DECIDED

**No enemy may reach the bottom of the corridor.** A breach costs **one life**
(3 lives per game; game over at 0) and resets combo/streak. Because a breach
is now so costly, enemies start **fairly slow** and speed ramps up gradually
as a function of kills/score, not level jumps — preserving the slow-burn goal.

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
- **Target look (Scott's reference still, 2026-09):** low eye level with the
  horizon just above mid-frame; very tall translucent pillars whose nearest
  rows exit the top of frame; semi-transparent dark-teal face fills with
  additive (lighter) blending so pillars show through each other; white-hot
  edge strokes; radial base flares where pillars meet the floor; bundled
  3-track orthogonal bus traces with bright cores; depth fog attenuating
  distant towers; monospace text texture rendered offscreen and scaled onto
  faces (micro-lines in the distance).

## D4. Controls — DECIDED

- **Mouse-driven:** an aiming target follows the mouse; **left click = fire**.
- **Secondary click (right click) = bomb** — screen-clearing style weapon.
  Starts each game with 3 bombs; more awarded at score milestones
  (threshold rule: see scoring decisions).

## D9. Player weapon placement — DECIDED (amended)

Cannon sits in the corridor (between the towers) and **translates side-to-side**
along the corridor mouth, driven by the mouse; aiming is done with the
mouse-driven targeting reticle. Firing is fast laser bolts (D14).

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
Implemented in the 0.2.0 build (`DIFF.LIFE_INTERVAL` / `DIFF.LIVES_CAP`).

## D15. Power-ups — DECIDED (amended)

**Code patches:** small floppy-disk icons drift down the lanes toward the
cannon. **They must be shot to collect** — one that reaches the bottom un-shot
fizzles with no effect. Types:
- **SLOW ×3 tiers** — three colors, each a different slow-down strength:
  slowest-drifting disk = least slowdown, fastest (hardest to hit) = most
  slowdown. Tier I green (mild), II amber (strong), III magenta (strongest).
- **RAPID** — triple-shot laser for a duration
- **SHLD** — absorbs the next breach
- **BOMB** — +1 bomb
Spawned infrequently; patch colors are fixed (not palette-dependent).

## D16. Breach rule & ramp — DECIDED

**No bug may reach the bottom of the corridor** — a breach costs a life
(3 lives to start; SHLD patch absorbs one breach). Game over at 0 lives.
Because breaches are now fail-state, enemy speed starts out **fairly slow**
and ramps gradually with total kills (smooth curve, hard-capped), so early
play is comfortable and pressure builds over time.

## D17. Display — DECIDED

Game canvas scales responsively to fit its window (letterboxed aspect ratio,
mouse coordinates remapped through the scale).

## D5. Audio — DECIDED (see D5 above; WebAudio procedural synth)

## D6. Level structure — DECIDED (matches Tempest, adapted)

16 web shapes cycling with palette-band rotation; corrupted-trace dodge during
warp; random shapes after level 99. Adaptation: bomb is ammo-based (start 3,
milestone awards) instead of Tempest's per-level Superzapper recharge. Each
level also reconfigures the corridor towers (see D2).

## D8. Enemy visual design — DECIDED

**Neon wireframe bugs with color-filled body sections and a dark underlay
halo.** Each bug draws twice: a near-black silhouette pass underneath (creates
contrast against bright tower faces and traces), then the neon pass with
filled bodies/cores — rootkit chevrons filled, voltworm membrane translucent
fill + solid core, tanglebug solid white core, hive translucent rhombus fill.
Line width increased over the pure-wireframe draft.

## D18. Hosting & exposure — DECIDED (local hosting via Cloudflare)

PolybAIus will be hosted **locally on the homelab and exposed via Cloudflare,
mirroring the resume site pattern**:

- Static site — no backend; the whole game (HTML/JS) served by a
  `caddy:2-alpine` container.
- Deployed as a **Dockhand Docker Compose stack** on **docker-staging first,
  docker-prod for release**, per the homelab-docker-stacks skill (Hawser
  volume path + PROJECT.md tracking manifest).
- Public exposure via the existing **Cloudflare tunnel** hostnames on the
  services domain — proposed `polybaius.endofline.io` (same mechanism as
  scotthepburn.com). Cloudflare API/DNS changes are made from docker-prod
  egress only (token restriction).
- No TLS cert management needed at the app layer (tunnel terminates TLS);
  Caddy serves plain HTTP inside the tunnel.

## D7. Repository / tooling — DECIDED

Plain static site, no bundler, no framework. Git + Forgejo remote optional
(init6/homelab). Lint via `npx eslint` optional later; no CI needed until tests
exist.

## D8. Enemy visual design — DECIDED (implemented)

**Neon wireframe bugs with color-filled body sections and a dark underlay
halo** — as shipped in the production build (see `src/js/entities.js`):
rootkit chevrons filled, voltworm membrane fill + solid core, tanglebug solid
white core, hive translucent rhombus fill; dark silhouette underlay pass for
contrast against bright tower faces.

- **A. Neon wireframe bugs** — articulated glowing line-art creatures (most
  Tempest-faithful).
- B. Solid membrane bugs with emissive outlines.
- C. Pixel/sprite bugs — clashes with the vector aesthetic; listed for completeness.
