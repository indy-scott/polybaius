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
| Superzapper | **PANIC.exe** — one full-web purge per level, second use kills one random bug |
| Warp to next level | Fly down the web into ZOD's core; dodge corrupted traces |
| 16 level shapes | 16 web shapes (circle, V, plus, bow-tie, heart, star, infinity...) |

Progressive levels cycle the 16 shapes with rising difficulty and a new palette
band every cycle — exactly like Tempest's color rotation, but in Hackers tones.

## Difficulty ramp (slow burn)

- Enemy speed starts low and increases as a **smooth function of level and
  kill-count**, not per-level jumps. Target: a competent player survives
  15–25 minutes per run.
- Spawn rate, enemy mix, and simultaneous-lane pressure all ramp on separate
  curves so difficulty climbs in texture, not just speed.

## Scoring & high scores

- Points per bug type; trace-shooting gives small points (and clears your warp path).
- Extra life at score intervals (cap 6, like Tempest).
- **High score table persisted in the browser (localStorage), top 10, with 3-letter
  initials entry — arcade style.**

## Aesthetic (from the Hackers Gibson screenshots)

- **Void black background.** No skybox, no horizon glow except the web itself.
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
- Keyboard-first controls; consider mouse/touch as secondary.
