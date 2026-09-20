// Tempest-style warp between levels (D6): the cannon flies down the corridor
// toward ZOD's core. Corrupted-trace blocks sit on lanes; steer to dodge,
// or shoot them for small points. A hit costs a life (SHLD absorbs one)
// but the warp itself keeps going.

import { CX, N, LANE_SP, DIFF } from "./constants.js";
import { PAL } from "./palettes.js";
import { sfx } from "./audio.js";
import { P } from "./world.js";

export function laneLat(lane) {
  return (lane - (N - 1) / 2) * LANE_SP;
}

function depthProgress(p) {
  // Mix linear + quad so the cannon accelerates toward the vanishing point
  // without spending the whole 3.5s still near the rim (screenshotable mid-warp).
  return p * .5 + p * p * .5;
}

export function enterWarp(s) {
  if (s.phase === "warp") return;
  s.phase = "warp";
  s.bugs = [];
  s.patches = [];
  const n = Math.min(DIFF.WARP_TRACE_MAX, DIFF.WARP_TRACE_MIN + (s.level - 1) * DIFF.WARP_TRACE_PER_LEVEL); // QA DEFECT-3: level 1 realizes WARP_TRACE_MIN
  const traces = [];
  let lane = Math.floor(Math.random() * N);
  for (let i = 0; i < n; i++) {
    lane = (lane + 1 + Math.floor(Math.random() * (N - 2))) % N;
    traces.push({
      lane,
      t: .16 + (i + .4) * (.70 / n),
      half: .038 + Math.random() * .018,
      dead: false,
      hit: false,
      visible: true,
      x: 0, y: 0, s: 1, rad: 10,
    });
  }
  s.warp = {
    elapsed: 0,
    traces,
    playerT: 1,
    iframe: 0,
    hits: 0,
    shots: 0,
  };
  sfx.warp();
}

export function completeWarp(s, genWorld, waveNeedFor) {
  s.phase = "play";
  s.warp = null;
  s.level++;
  s.waveKills = 0;
  s.waveNeed = waveNeedFor(s.level);
  s.shots = [];
  s.bombFx = .45; // arrival flash
  genWorld();
}

function projectTrace(tr, playerT) {
  // playerT is the camera near-plane. A trace at world t maps to displayT =
  // tr.t / playerT, so it grows as the cannon flies into it.
  if (tr.dead) { tr.visible = false; return; }
  if (playerT < tr.t - tr.half) { tr.visible = false; return; }
  const dispT = Math.max(.02, Math.min(1, tr.t / Math.max(.12, playerT)));
  const lat = laneLat(tr.lane);
  const q = P(lat, dispT);
  tr.x = q.x; tr.y = q.y; tr.s = q.s;
  tr.rad = 16 * q.s + 6;
  tr.visible = true;
  tr.dispT = dispT;
}

export function tickWarp(s, dt, hooks) {
  const w = s.warp;
  if (!w) return;
  w.elapsed += dt;
  const p = Math.min(1, w.elapsed / DIFF.WARP_DURATION);
  w.playerT = 1 - depthProgress(p) * .88;
  w.iframe = Math.max(0, w.iframe - dt);
  w.traces.forEach(tr => projectTrace(tr, w.playerT));

  if (!s.gameOver && w.iframe === 0) {
    for (const tr of w.traces) {
      if (tr.dead || tr.hit || !tr.visible) continue;
      const onLane = Math.abs(s.cannonLat - laneLat(tr.lane)) < LANE_SP * .5;
      const onDepth = w.playerT <= tr.t + tr.half && w.playerT >= tr.t - tr.half;
      if (onLane && onDepth) {
        tr.hit = true;
        w.hits++;
        w.iframe = .4;
        if (s.shield) {
          s.shield = false;
          hooks.boom(tr.x, tr.y, PAL.text, 10);
        } else {
          s.lives--;
          s.flash = 1;
          hooks.resetChain();
          sfx.breach();
          hooks.boom(s.cannonScreen.x, s.cannonScreen.y - 24, "#ff2244");
          if (s.lives <= 0) hooks.beginGameOver();
        }
        break;
      }
    }
  }

  if (p >= 1 && !s.gameOver) hooks.completeWarp();
}

export function hitWarpTrace(s, sh, sweep, boom) {
  const w = s.warp;
  if (!w) return false;
  const hit = w.traces.find(tr => !tr.dead && tr.visible && sweep(tr, tr.rad));
  if (!hit) return false;
  hit.dead = true;
  w.shots++;
  s.score += DIFF.TRACE_SCORE;
  boom(hit.x, hit.y, PAL.trace, 8);
  sfx.traceShot();
  sh.dead = true;
  return true;
}

export function bombWarpTraces(s, boom) {
  const w = s.warp;
  if (!w) return;
  w.traces.forEach(tr => {
    if (!tr.dead) { tr.dead = true; boom(tr.x, tr.y, PAL.trace, 6); }
  });
}

export function drawWarp(ctx, s, now) {
  const w = s.warp;
  if (!w) return;
  const t = now / 1000;
  const p = Math.min(1, w.elapsed / DIFF.WARP_DURATION);

  ctx.globalCompositeOperation = "lighter";
  const coreR = 14 + p * 55;
  const cg = ctx.createRadialGradient(CX, P(0, .02).y, 2, CX, P(0, .02).y, coreR);
  cg.addColorStop(0, "#eaffff");
  cg.addColorStop(.35, PAL.web + "aa");
  cg.addColorStop(1, "#0000");
  ctx.fillStyle = cg;
  ctx.beginPath(); ctx.arc(CX, P(0, .02).y, coreR, 0, 7); ctx.fill();

  const nLines = 18;
  ctx.strokeStyle = PAL.web;
  ctx.globalAlpha = .18 + p * .35;
  ctx.lineWidth = 1.2;
  for (let i = 0; i < nLines; i++) {
    const a = (i / nLines) * Math.PI * 2 + t * 1.7;
    const u = ((t * 1.4 + i * .17) % 1);
    const r0 = 12 + u * 80;
    const r1 = r0 + 30 + p * 90;
    const vx = Math.cos(a), vy = Math.sin(a) * .55 + .65;
    ctx.beginPath();
    ctx.moveTo(CX + vx * r0, P(0, .02).y + vy * r0 * .35);
    ctx.lineTo(CX + vx * r1, P(0, .02).y + vy * r1 * .85);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  w.traces.forEach(tr => drawCorruptTrace(ctx, tr, w.playerT, t));
  ctx.globalCompositeOperation = "source-over";

  ctx.textAlign = "center";
  ctx.shadowColor = PAL.web; ctx.shadowBlur = 16;
  ctx.fillStyle = PAL.text; ctx.font = "18px monospace";
  ctx.fillText("WARP TO CORE", CX, 42);
  ctx.shadowBlur = 8;
  ctx.font = "11px monospace"; ctx.fillStyle = PAL.web;
  ctx.fillText("STEER TO DODGE  ·  SHOOT TO CLEAR", CX, 62);
  ctx.shadowBlur = 0; ctx.textAlign = "left";
}

function drawCorruptTrace(ctx, tr, playerT, tnow) {
  if (tr.dead || !tr.visible) return;
  const t0 = Math.max(.02, (tr.t - tr.half) / Math.max(.12, playerT));
  const t1 = Math.min(1, (tr.t + tr.half) / Math.max(.12, playerT));
  const lat = laneLat(tr.lane);
  const hw = LANE_SP * .38;
  const a = P(lat - hw, t0), b = P(lat + hw, t0);
  const c = P(lat + hw, t1), d = P(lat - hw, t1);
  const flicker = .75 + .25 * Math.sin(tnow * 17 + tr.lane);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = flicker;
  ctx.fillStyle = PAL.trace;
  ctx.shadowColor = PAL.trace;
  ctx.shadowBlur = 14 * tr.s;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y);
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#ffeaff"; ctx.lineWidth = Math.max(1, 1.6 * tr.s);
  ctx.shadowColor = "#fff"; ctx.shadowBlur = 8 * tr.s;
  ctx.beginPath();
  const midL = P(lat, t0), midN = P(lat, t1);
  ctx.moveTo(midL.x, midL.y); ctx.lineTo(midN.x, midN.y); ctx.stroke();
  // Via pads at the near end: reads as a broken PCB segment, not a sprite.
  ctx.fillStyle = PAL.pad;
  ctx.shadowColor = PAL.pad; ctx.shadowBlur = 6;
  const pad = 2.2 * tr.s + 1;
  ctx.fillRect(c.x - pad, c.y - pad, pad * 2, pad * 2);
  ctx.fillRect(d.x - pad, d.y - pad, pad * 2, pad * 2);
  ctx.restore();
}
