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

[0.1.1]: https://github.com/indy-scott/polybaius/releases/tag/v0.1.1
[0.1.0]: https://github.com/indy-scott/polybaius/releases/tag/v0.1.0

