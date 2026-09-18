# PolybAIus

A browser-based, Tempest-inspired arcade shooter set inside the mainframe of the
supercomputer **ZOD**, styled after the 1995 film *Hackers* "Gibson" cyberspace
sequences.

You are the last defense daemon on ZOD. Viruses and intrusion bugs — small
crawling creatures with animated limbs — climb the data web toward the rim.
Blast them before they reach you.

## Status

**Pre-production.** Design docs in `docs/`, visual direction samples in
`samples/`. Core gameplay not yet implemented.

## Running

No build step required — the game is plain HTML/JS served statically:

```
python3 -m http.server 8080
# open http://localhost:8080/src/index.html
```

## Layout

- `docs/` — design brief, decision log, implementation plan
- `samples/` — throwaway visual/gameplay direction samples (not shipped code)
- `src/` — game source
- `assets/` — fonts, sprites, audio

## Design pillars

1. **Tempest core** — blaster on the rim of a multi-lane web, enemies climb,
   Superzapper panic button, 16 level shapes, warp-between-levels.
2. **Hackers (1995) aesthetic** — emissive neon on pitch black, monospace
   text-as-texture, PCB floor traces, heavy bloom. Code is the building material.
3. **Slow burn difficulty** — speed ramps gently so a good run lasts a long time.
4. **Fully in-browser** — no install, no server dependency; scores persist locally.
