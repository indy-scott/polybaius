# PolybAIus

A browser-based, Tempest-inspired arcade shooter set inside the mainframe of the
supercomputer **ZOD**, styled after the *Hackers* (1995) "Gibson" cyberspace
sequences.

You are ZOD's defense cannon — a PCB-layout component turret seated in a glowing
corridor between towering data monoliths. Viruses and intrusion bugs — small
creatures with animated limbs — descend the corridor toward you. Nothing gets
past the rim.

![Gameplay — the Gibson corridor](assets/gameplay.png)

> Play it: serve the repo (`python3 -m http.server 8080`) and open
> `http://localhost:8080/src/` — click **START**. Native ES modules, no
> bundler, no backend. The board letterboxes to fit any window and renders
> at native device resolution (crisp on large/high-DPI screens). The v5
> sample at `samples/corridor-sample-v5.html` remains the behavior reference.

## Status

**Pre-production → playable src/ build.** All design decisions (D1–D18) are
locked in `docs/decision-log.md`. Production entry is `src/index.html`
(modular ES modules extracted from the v5 sample). The behavior reference
remains `samples/corridor-sample-v5.html`.

## Gameplay

Core loop (Tempest mechanics, Gibson presentation):

- A **PCB cannon** slides side-to-side along the corridor mouth, aimed with the
  mouse; **left click** fires fast laser bolts, **right click** detonates a bomb.
- **No bug may reach the bottom** — a breach costs a life (3 to start; game over
  at zero).
- Enemy speed starts slow and ramps gradually with total kills (smooth, capped)
  so the first ~2 minutes are calm and pressure compounds through mid-game,
  then hard-caps late. A good run should last 15-25 minutes. Tuning lives in
  one `DIFF` object in `src/js/constants.js`.
- After a wave's quota is cleared, a **warp to ZOD's core** (~3.5s): steer
  around corrupted traces on the lanes (or shoot them for 50 points). A hit
  costs a life; SHLD still absorbs one. Reaching the core re-rolls the
  corridor and advances the level.
- **Skill-Step:** on the title screen, A/D or arrow keys pick start level 1-8.
  Starting at N seeds that level's difficulty baseline (spawn, speed, mix,
  wave quota) on the same curve. Score-per-kill is unchanged.

### Enemies (Tempest roles, hacker names)

| Enemy | Tempest analog | Behavior |
|---|---|---|
| Rootkit | Flipper | hops lane-to-lane toward the rim |
| Voltworm | Pulsar | periodically floods its lane |
| Tanglebug | Fuseball | jukes unpredictably, hard to hit |
| Hive | Tanker | slow, tanky, splits when destroyed |

![Enemy codex and code patches](assets/enemies.png)

### Code patches (power-ups)

Floppy-disk icons drift down the lanes. **They must be shot to collect** — one
that lands un-shot fizzles with no effect.

| Patch | Color | Effect |
|---|---|---|
| S1 | green | slow viruses 25% for 6s (drifts slow — easy) |
| S2 | amber | slow viruses 40% for 6s |
| S3 | magenta | slow viruses 60% for 6s (drifts fast — hard to hit) |
| RAP | cyan | triple-shot laser for 8s |
| SHL | violet | absorbs the next breach |
| BMB | white | +1 bomb |

### How a run plays

1. **Descend & defend.** Bugs spawn at the far end of the corridor and advance
   down one of 8 lanes toward your cannon. Anything that reaches the bottom
   costs a life — you have 3, and there are no continues.
2. **Ramp.** Enemy speed and spawn rate start gentle and rise smoothly with
   your total kill count (hard-capped), so the first ~2 minutes are calm and
   the pressure compounds over time. Bug variety widens as you rack up kills
   (Voltworms after 40, Tanglebugs after 80, Hives after 180).
3. **Waves, warp, levels.** Clearing a wave's quota starts a warp down the
   corridor toward ZOD's core. Corrupted traces sit on lanes: steer to dodge
   or shoot them for 50 points. Hitting one costs a life (SHLD absorbs one);
   the warp keeps going. Reaching the core re-rolls the corridor (tower
   heights, hue, text) and raises the next wave quota.
4. **Patches.** Floppy disks drift down occasionally. Shoot them to collect;
   a disk that lands un-shot is wasted. Tiers trade risk for power: the
   slow-drifting green S1 is easy to hit but only slows viruses 25%, while
   the fast magenta S3 is a hard target worth 60% slowdown.
5. **Game over.** At zero lives the run ends. If your score makes the top 10
   you enter 3-letter arcade initials; the table persists in `localStorage`.
6. **Chase the multipliers.** The combo chain (×8 max) and bomb-award kill
   streaks both die on a missed shot or a breach — the high-score chase is
   about accuracy under pressure, not just speed.

### Scoring

- Base points per bug, multiplied by a **combo chain** — consecutive hits
  without a miss build the multiplier (up to ×8); a missed shot or a breach
  resets it.
- **Bombs:** start with 3; a kill streak with no misses and no damage at
  escalating thresholds (first at 15) awards another — deliberately hard to
  chain.
- Extra life every 75,000 points (max 6 in reserve).
- **High scores:** arcade-style top-10 table with 3-letter initials entry,
  persisted in `localStorage` — works offline, zero backend.

## Visual direction

Everything on screen is emissive neon on a void-black Gibson corridor, rendered
with **"lightweight 3D"**: Canvas 2D with manual one-point perspective
projection (2.5D) — flat neon look kept, depth from scale-by-distance geometry.
No WebGL.

- Low eye level; horizon just above mid-frame; the nearest data monoliths exit
  the top of the frame.
- Towers are translucent additive boxes — text-as-texture (log lines, directory
  trees, hex dumps, password strings, netstat tables), wireframe sub-panels,
  white-hot edges, base flares.
- The floor is a PCB: bundled 3-track orthogonal bus traces with traveling
  pulses.
- Every level re-rolls tower heights, color scheme, and text content.
- Six selectable palettes: **Gibson Cyan (default)**, Toxic Terminal,
  Violet Flux, Amber Mainframe, Glacier Ice, Red Alert.
- CRT finish: scanlines over the canvas.

## Controls

| Input | Action |
|---|---|
| Mouse move | slide the cannon / aim |
| Click **START** (or Enter/Space) | begin the game |
| A / D or arrow keys | pick start level 1-8 (title screen only) |
| Left click | fire laser |
| Right click | bomb |
| M | mute (WebAudio procedural SFX) |
| Keyboard | initials entry on game over |

## Repository layout

```
docs/      design brief, decision log (D1–D18), implementation plans
samples/   visual/gameplay prototypes (v1–v5; v5 is the reference)
src/       production game (ES modules: renderer, entities, waves, UI)
assets/    fonts, sprites, audio (currently none — everything is procedural)
```

## Running

No dependencies, no build step:

```
python3 -m http.server 8080
# production:  http://localhost:8080/src/
# v5 sample:   http://localhost:8080/samples/corridor-sample-v5.html
```

`src/` uses native ES modules, so it needs `http://` (opening the HTML as
`file://` will not load). The v5 sample is still a single file and works
either way.

## Deployment (planned)

Static hosting on the homelab, exposed via Cloudflare — mirroring the
scotthepburn.com pattern:

- `caddy:2-alpine` container deployed as a Dockhand Docker Compose stack
  (docker-staging first, then docker-prod).
- Public URL via the existing Cloudflare tunnel: `polybaius.endofline.io`.
- Cloudflare/DNS changes are made from docker-prod egress only.

## Versioning

Semantic versioning; see [CHANGELOG.md](CHANGELOG.md). Current: **v0.2.0**
(warp sequence, skill-step start level, tuned difficulty curve, QA fixes).

## Roadmap

- [x] Production implementation in `src/` (modular: renderer, entities, waves, UI)
- [x] Level warp sequence + corrupted-trace dodge
- [x] Skill-Step starting level
- [x] Difficulty curve tuning for 15-25 minute runs
- [x] Caddy deploy on docker-prod (`polybaius.endofline.io` served via file_server)
- [ ] Cloudflare tunnel public hostname — DNS CNAME created; needs the ingress
      rule added in the Zero Trust dashboard (Tunnels → caddy tunnel → Public
      Hostname: `polybaius.endofline.io` → `HTTP://localhost:80`), which
      requires an account-scoped API token we don't hold
