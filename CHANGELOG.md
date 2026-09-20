# Changelog

All notable changes to PolybAIus are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/); versioning is
[SemVer](https://semver.org/).

## [0.1.0] — 2026-09-18

Pre-production prototype: visual direction and gameplay design locked.

### Added
- Design docs: `docs/design-brief.md`, `docs/decision-log.md` (decisions
  D1–D18: rendering stack, art direction, controls, scoring, hosting).
- Visual direction samples: palettes, enemy gallery, playfield demos.
- Corridor prototype iterations (`samples/`):
  - v2 — Gibson corridor, mouse aim, combo multiplier, streak bombs,
    per-level tower reconfiguration.
  - v3 — 2.5D one-point perspective, PCB floor traces, side-to-side cannon,
    laser bolts, floppy code patches, lives, WebAudio SFX.
  - v4 — fixed laser fire, shoot-to-collect patch tiers (S1/S2/S3),
    3D-shaded towers, responsive canvas.
  - v5 (reference) — reference-look depth: low eye level, translucent
    additive pillars, base flares, bundled bus traces, depth fog; arcade
    high-score entry (3-letter initials) with localStorage top-10;
    high-contrast bugs (dark underlay halo + filled body parts);
    shortened cannon.
- Enemy roster: Rootkit, Voltworm, Tanglebug, Hive (Tempest-flipper/pulsar/
  fuseball/tanker analogs).

### Decided
- Canvas 2D + manual perspective ("lightweight 3D"), WebAudio procedural
  audio, combo-chain scoring, streak-awarded bombs, arcade high-score table,
  Gibson Cyan default palette, local hosting via Cloudflare tunnel.

## [0.1.1] — 2026-09-18

Documentation release.

### Added
- README graphics: gameplay screenshot (`assets/gameplay.png`) and enemy/patch
  codex (`assets/enemies.png`), captured from the v5 prototype via a
  deterministic `?photo` capture mode (headless Chromium + canvas buffer
  extraction).
- "How a run plays" gameplay walkthrough in the README.

### Fixed
- v5 photo mode: laser bolt origin follows the shortened muzzle.

## [0.1.3] - 2026-09-19

Gameplay features from the README roadmap (warp, skill-step, difficulty curve).

### Added
- Level warp sequence: clearing a wave quota flies the cannon toward ZOD's
  core (~3.5s). Corrupted-trace blocks sit on lanes; steer to dodge or shoot
  for 50 points. A hit costs a life (SHLD absorbs one); the warp continues.
  Reaching the core re-rolls the corridor and advances the level. HUD shows
  WARP TO CORE.
- Skill-Step start level: title overlay shows START LEVEL 1-8, adjustable with
  A/D or arrow keys. Enter/Space/M are unchanged. Starting at N seeds that
  point on the difficulty curve (kills, spawn, speed, mix, wave quota).
- `DIFF` config object in `src/js/constants.js`: ramp rate, spawn interval,
  speed cap, wave quota growth, patch frequency, mix thresholds. New module
  `src/js/warp.js`.

### Changed
- Difficulty reshape (not an easier ceiling): first ~2 minutes calm, mid-game
  compounding, hard cap around 13 minutes matching the previous late-game
  bite. Projected time-to-death for a solid player is 15-25 minutes.

## [0.2.0] — 2026-09-19

Feature release: the production build in `src/` is now feature-complete per the
design brief. Dev profile implementation, QA profile verification
(overall SHIP; 7 minor findings, 4 fixed in this release).

### Added
- **Level warp sequence + corrupted-trace dodge** (`src/js/warp.js`): clearing a
  wave triggers a 3.5s fly-in toward ZOD's core; corrupted-trace blocks must be
  dodged (steer) or shot (50 pts, no combo); a hit costs a life (SHLD absorbs);
  core arrival advances the level and re-rolls the corridor.
- **Skill-Step starting level**: `START LEVEL: N` (1-8) on the title screen,
  adjusted with A/D or arrows; seeds the difficulty baseline via
  `DIFF.START_KILLS` (wave quota `8+(level-1)*3`).
- **Difficulty tuning** consolidated into a documented `DIFF` object: calm
  first ~2 minutes (speed .048, 2.4s spawns), compounding pressure, hard cap
  (speed .360 / 0.50s spawns at ~567 kills ≈ 13.3 min) — modeled time-to-death
  in the 15-25 minute band.
- **Extra life every 75,000 points** (D13, previously deferred), capped at 6.

### Fixed (QA findings)
- Residual warp state after a lethal warp hit (game-over state machine cleanup).
- Bug-mix thresholds now inclusive (match the documented 40/80/180 kill marks).
- Warp trace count realizes `WARP_TRACE_MIN` at level 1.

## [0.1.2] — 2026-09-19

Prototype polish release (dev profile implementation, qa profile verification —
QA verdict: PASS, 8/8 items, no defects).

### Added
- Arcade start overlay: the game no longer simulates on page load; starts on
  click or Enter/Space; after game over + high-score entry it returns to the
  title screen (input cooldown prevents accidental instant restart).
- Letterboxed fit-to-viewport scaling: 900x640 aspect preserved and centered
  on any window size — the board is never cut off.
- Device-resolution backing store (CSS size x devicePixelRatio, capped at
  ~2560px wide) with a logical 900x640 coordinate space — crisp graphics on
  large/high-DPI displays instead of upscaled blur. Live resize handling.

### Changed
- Render-loop efficiency: corridor scenery (towers, floor traces, lane glow)
  baked once per level/palette/resize to an offscreen canvas and blitted;
  trace points pre-projected; shadowBlur restricted to near sprites and
  replaced with additive under-strokes on lasers; HUD DOM writes gated on
  string change; in-place draws instead of per-frame array slices.

[0.1.2]: https://github.com/indy-scott/polybaius/releases/tag/v0.1.2
[0.1.1]: https://github.com/indy-scott/polybaius/releases/tag/v0.1.1
[0.1.0]: https://github.com/indy-scott/polybaius/releases/tag/v0.1.0

