// Game state, waves, combat, scoring (D4, D10, D11, D14, D15, D16).
// Extra life at 75k (D13), hive split, silkworms, and warp are not in v5: deferred.

import { W, H, CX, FLOOR, N, LANE_SP, MUZZLE_Y, BASE, PATCH_POOL, pick } from "./constants.js";
import { PAL } from "./palettes.js";
import { audio, sfx } from "./audio.js";
import { qualifies } from "./hiscores.js";
import { P, genWorld, pulses } from "./world.js";

export const state = {
  bugs: [], shots: [], parts: [], patches: [],
  score: 0, combo: 0, streak: 0, bombs: 3, lives: 3,
  level: 1, waveKills: 0, waveNeed: 8, totalKills: 0,
  spawnT: 2.2, patchT: 9,
  mouse: { x: CX, y: H - 170 },
  flash: 0, bombFx: 0, nextStreak: 15, cannonLat: 0,
  slowT: 0, slowFactor: 1, rapidT: 0, shield: false,
  gameOver: false, started: false, titleCool: 0, cannonYOff: 0,
  cannonScreen: { x: CX, y: FLOOR + 10 },
  overPhase: "", entryBuf: "",
};

export function mult() { return Math.min(8, 1 + Math.floor(state.combo / 4)); }
export function resetChain() { state.combo = 0; state.streak = 0; }

export function bumpStreak() {
  if (state.streak >= state.nextStreak) {
    state.bombs = Math.min(9, state.bombs + 1);
    state.nextStreak += 15 + Math.floor(state.nextStreak * .6);
    sfx.bombAward();
  }
}

export function boom(x, y, col, n) {
  for (let i = 0; i < (n || 10); i++) {
    state.parts.push({ x, y, vx: (Math.random() - .5) * 180, vy: (Math.random() - .5) * 180, life: .5, col });
  }
}

export function applyPatch(type) {
  sfx.patch();
  if (type.slow) { state.slowT = 6; state.slowFactor = type.slow; }
  else if (type.id === "RAP") state.rapidT = 8;
  else if (type.id === "SHL") state.shield = true;
  else if (type.id === "BMB") state.bombs = Math.min(9, state.bombs + 1);
}

export function resetGame() {
  const s = state;
  s.bugs = []; s.shots = []; s.parts = []; s.patches = [];
  s.score = 0; s.combo = 0; s.streak = 0; s.bombs = 3; s.lives = 3;
  s.level = 1; s.waveKills = 0; s.waveNeed = 8; s.totalKills = 0;
  s.spawnT = 2.2; s.patchT = 9; s.slowT = 0; s.slowFactor = 1; s.rapidT = 0;
  s.shield = false; s.gameOver = false; s.nextStreak = 15;
  genWorld();
}

export function beginPlay() {
  state.started = true;
  try { audio().resume(); } catch (e) { /* autoplay policy */ }
}

export function returnToTitle() {
  resetGame();
  state.started = false;
  state.titleCool = .35; // swallow the dismiss click so a double-click does not auto-start
}

export function beginGameOver() {
  state.gameOver = true;
  state.overPhase = qualifies(state.score) ? "entry" : "table";
  state.entryBuf = "";
}

export function fireLaser() {
  const s = state;
  const dx = s.mouse.x - s.cannonScreen.x, dy = s.mouse.y - (s.cannonScreen.y - MUZZLE_Y), m = Math.hypot(dx, dy) || 1;
  const angles = s.rapidT > 0 ? [-.12, 0, .12] : [0];
  angles.forEach(a => {
    const ca = Math.cos(a), sa = Math.sin(a);
    s.shots.push({
      x: s.cannonScreen.x, y: s.cannonScreen.y - MUZZLE_Y,
      px: s.cannonScreen.x, py: s.cannonScreen.y - MUZZLE_Y,
      vx: (dx * ca - dy * sa) / m * 1500, vy: (dx * sa + dy * ca) / m * 1500,
    });
  });
  sfx.laser();
}

export function dropBomb() {
  const s = state;
  if (s.bombs <= 0) return;
  s.bombs--; s.bombFx = 1; sfx.bomb();
  s.bugs.forEach(b => boom(b.x, b.y, PAL.bug[b.type], 6)); s.bugs = [];
}

function rampSpeed() { return (.065 + Math.min(.30, state.totalKills * .0024)) * state.slowFactor; }

export function tick(dt, now) {
  const s = state;
  const t = now / 1000;
  s.titleCool = Math.max(0, s.titleCool - dt);

  if (s.started) {
    const targetLat = Math.max(-.85, Math.min(.85, (s.mouse.x - CX) / 430));
    s.cannonLat += (targetLat - s.cannonLat) * Math.min(1, dt * 10);
  } else {
    s.cannonLat = 0;
  }
  const CANNONP = P(s.cannonLat, 1);
  s.cannonScreen.x = CANNONP.x; s.cannonScreen.y = CANNONP.y + 6 + (s.cannonYOff || 0);

  if (s.started && !s.gameOver) {
    s.spawnT -= dt; if (s.spawnT <= 0) {
      s.spawnT = Math.max(.55, 2.2 - s.totalKills * .014);
      const lane = Math.floor(Math.random() * N);
      s.bugs.push({
        lane, t: .02,
        type: ["rootkit", "voltworm", "tanglebug", "hive"][Math.floor(Math.random() * (s.totalKills > 30 ? 4 : s.totalKills > 12 ? 3 : 1))],
        ph: Math.random() * 7, x: 0, y: 0,
      });
    }
    s.patchT -= dt; if (s.patchT <= 0) {
      s.patchT = 11 + Math.random() * 7;
      s.patches.push({ lane: Math.floor(Math.random() * N), t: .02, ph: Math.random() * 7, x: 0, y: 0, type: pick(PATCH_POOL) });
    }
    s.slowT = Math.max(0, s.slowT - dt); if (s.slowT === 0) s.slowFactor = 1;
    s.rapidT = Math.max(0, s.rapidT - dt);
  }

  if (s.started) {
    s.bugs.forEach(b => {
      b.t += dt * rampSpeed() * (b.type === "hive" ? .75 : 1);
      const lat = (b.lane - (N - 1) / 2) * LANE_SP + Math.sin(t * 3 + b.ph) * .04 * b.t;
      const p = P(lat, b.t); b.x = p.x; b.y = p.y; b.s = p.s; b.rad = 15 * p.s + 4;
      if (b.t >= 1) {
        b.dead = true;
        if (s.shield) { s.shield = false; boom(b.x, b.y, PAL.text, 10); }
        else {
          s.lives--; s.flash = 1; resetChain(); sfx.breach();
          boom(s.cannonScreen.x, s.cannonScreen.y - 24, "#ff2244");
          if (s.lives <= 0) beginGameOver();
        }
      }
    });
    s.bugs = s.bugs.filter(b => !b.dead);
    s.patches.forEach(p => {
      p.t += dt * .055 * p.type.drift;
      const lat = (p.lane - (N - 1) / 2) * LANE_SP;
      const q = P(lat, p.t); p.x = q.x; p.y = q.y; p.s = q.s; p.rad = 14 * q.s + 4;
      if (p.t >= 1) { p.dead = true; boom(p.x, p.y, p.type.col, 4); }
    });
    s.patches = s.patches.filter(p => !p.dead);
    s.shots.forEach(sh => {
      sh.px = sh.x; sh.py = sh.y; sh.x += sh.vx * dt; sh.y += sh.vy * dt;
      const sweep = (o, rad) => {
        const dx = sh.x - sh.px, dy = sh.y - sh.py, L2 = dx * dx + dy * dy || 1;
        let u = ((o.x - sh.px) * dx + (o.y - sh.py) * dy) / L2; u = Math.max(0, Math.min(1, u));
        return Math.hypot(o.x - (sh.px + dx * u), o.y - (sh.py + dy * u)) < rad + 3;
      };
      const hit = s.bugs.find(b => sweep(b, b.rad));
      const phit = s.patches.find(p => sweep(p, p.rad));
      if (hit) {
        hit.dead = true; s.waveKills++; s.totalKills++; s.combo++; s.streak++; bumpStreak(); sfx.hit();
        s.score += BASE[hit.type] * mult(); boom(hit.x, hit.y, PAL.bug[hit.type], 12); sh.dead = true;
      }
      if (phit) { phit.dead = true; applyPatch(phit.type); boom(phit.x, phit.y, phit.type.col, 8); sh.dead = true; }
    });
    s.shots = s.shots.filter(sh => {
      if (sh.dead) return false;
      if (sh.x < -40 || sh.x > W + 40 || sh.y < -40 || sh.y > H + 40) { resetChain(); return false; }
      return true;
    });
    s.bugs = s.bugs.filter(b => !b.dead);
    s.parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; });
    s.parts = s.parts.filter(p => p.life > 0);
    pulses.forEach(p => { p.u = (p.u + dt * p.sp) % 1; });
    if (!s.gameOver && s.waveKills >= s.waveNeed) { s.waveKills = 0; s.level++; s.waveNeed = 8 + s.level; genWorld(); }
    s.flash = Math.max(0, s.flash - dt * 3); s.bombFx = Math.max(0, s.bombFx - dt * 1.5);
  }
}
