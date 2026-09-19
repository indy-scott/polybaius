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

[0.1.1]: https://github.com/indy-scott/polybaius/releases/tag/v0.1.1
[0.1.0]: https://github.com/indy-scott/polybaius/releases/tag/v0.1.0

