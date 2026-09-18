# PolybAIus — Design Brief v0.1

## Premise

The supercomputer **ZOD** is under attack. Intrusion daemons — bug-like viruses
with crawling limbs and twitching antennae — are entering through the data web
("the Wireway") that feeds ZOD's core. You are ZOD's defense daemon — a cannon
built from PCB-layout parts, seated on the outer rim of the web. Nothing gets
past you.

## References

- Tempest gameplay/mechanics: Wikipedia "Tempest (1981 video game)",
  arcade-history.com level/enemy breakdown
- Late-game difficulty reference: https://www.youtube.com/shorts/JdZunqHF0Gw
  ("Things getting crazy in Tempest")
- Aesthetic: Hackers (1995) Gibson sequences — screenshots provided by Scott;
  https://www.tumblr.com/scipunk/780398942735220736/hackers-1995

## Gameplay (Tempest core, mapped)

| Tempest element | PolybAIus element |
|---|---|
| Tube/web of 16 shapes | Data webs — circuit-trace webs floating in the Gibson void |
| Claw blaster on the rim | **PCB cannon on the rim** — the player weapon is built from PCB-layout parts: a component-shaped turret (silkscreen-outline cannon with solder pads and a via ring) seated on a copper trace that runs along the rim |
| Flippers | **Rootkits** — hop lane-to-lane toward the rim; lethal to touch |
| Pulsars | **Voltworms** — periodically electrify their whole lane |
| Fuseballs | **Tanglebugs** — white multi-tendriled spheres, jump along lane edges |
| Spikers | **Silkworms** — crawl up leaving a "corrupted trace" that must be shot away |
| Tankers | **Hives** — split into two lesser bugs when destroyed |
| Superzapper | **Bomb** (right click) — starts at 3 per game, more awarded at score milestones; clears all threats on screen |
| Warp to next level | Fly down the web into ZOD's core; dodge corrupted traces |
| 16 level shapes | 16 web shapes (circle, V, plus, bow-tie, heart, star, infinity...) |

Progressive levels cycle the 16 shapes with rising difficulty and a new palette
band every cycle — exactly like Tempest's color rotation, but in Hackers tones.

## Difficulty ramp (slow burn) & breach rule

- Enemies start **fairly slow**; speed increases as a smooth function of
  kills/score, not per-level jumps. Target: a competent player survives
  15–25 minutes per run.
- Spawn rate, enemy mix, and simultaneous-lane pressure all ramp on separate
  curves so difficulty climbs in texture, not just speed.
- **No enemy reaches the bottom.** A breach costs one life (3 per game) and
  resets combo/streak.

## Power-ups (code patches)

- Small floppy-disk icons float down the corridor toward the cannon.
- Collect by shooting them or by letting them arrive (no penalty either way).
- Abilities: **SLOW** (throttle virus flow), **RAPID** (triple-shot),
  **SHIELD** (absorb one breach), **+BOMB**.

## Scoring & high scores

- Base points per bug type; **combo chains** multiply them — consecutive hits
  without a miss build the multiplier; a missed shot or a breach resets it.
- Trace-shooting gives small points (and clears your warp path).
- **Bombs:** start with 3; a kill streak (consecutive kills, no misses, no
  damage) at escalating thresholds awards another — deliberately hard to chain.
- Extra life every 75,000 points (cap 6 in reserve).
- **High scores:** top 10 in localStorage with arcade-style 3-letter initials
  entry.

## Lives & power-ups

- **No bug reaches the bottom.** A breach costs a life (3 to start); game over
  at zero. SHLD patch absorbs one breach.
- **Code patches** — floppy-disk icons drifting down the lanes; shoot or catch
  them. SLOW (halve bug speed), RAPID (triple-shot), SHLD (absorb a breach),
  BOMB (+1 bomb).
- Enemy speed starts slow and ramps gradually with total kills (smooth,
  capped) — early game comfortable, pressure builds late.

## Aesthetic (from the Hackers Gibson screenshots)

- **Void black background.** No skybox, no horizon glow except the web itself.
- **Composition — the Gibson Corridor:** the PCB cannon sits in the middle of a
  corridor between two towering Gibson monoliths. Threats come down the corridor
  and along the web lanes toward the cannon.
- **Per-level tower reconfiguration:** every level changes tower height profiles,
  color scheme, and text content. Text is generated to sound real — directory
  trees (`/usr/lib/zod/`, `/var/spool/attack/`), file names (`knight.log`,
  `acid_burn.pw`, `garbage.asm`), password examples, systemd units, netstat
  tables, hex dumps, RSA key blocks.
- **Emissive neon only** — everything self-illuminated, heavy bloom, white-hot cores.
- **Monospace text as texture** — tower faces and HUD panels built from log lines,
  hex dumps, netstat tables, RSA key blocks.
- **PCB floor** — orthogonal circuit traces with pulses traveling along them.
- **Reflective dark floor** below the web, subtle.
- **CRT finish** — scanlines, slight chromatic aberration, mild film grain.
- Bugs are the one "organic" element: articulated little creatures (6 legs, antennae,
  animated limbs) rendered as neon wireframe/membrane hybrids.

## Tech constraints

- Runs fully in the browser, no install, no backend.
- 60 FPS on modest hardware.
- Mouse-first controls: cannon translates side-to-side with the mouse, left
  click fires fast laser bolts, right click detonates a bomb. Keyboard fallback only.

## Rendering

- "Lightweight 3D": Canvas 2D with manual one-point perspective projection —
  flat emissive neon kept, depth from scale-by-distance geometry. No WebGL.
