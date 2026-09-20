// One-point perspective + corridor world (D1). Towers, PCB traces, and lane
// guides are static between level/palette/resize, so they bake to an offscreen
// canvas and get blitted each frame (v0.1.2 render-loop cache).

import { W, H, HORIZON, FLOOR, VPX, N, LANE_SP, DIRS, FILES, PWS, SYS, TAGS, pick } from "./constants.js";
import { PAL, setHueShift, towerCol } from "./palettes.js";

export const view = { scaleX: 1, scaleY: 1, sceneryDirty: true };

export let towers = [];
export let traces = [];
export let pulses = [];
// Bumped in genWorld so tests can see a warp-to-core actually re-rolled the corridor.
export let worldGen = 0;

export function persp(t) { return 1 / (1 + (1 - t) * 2.2); } // t 0(far)..1(near) → .31..1
export function P(lat, t) {
  const s = persp(t);
  return { x: VPX + lat * 430 * s, y: HORIZON + (FLOOR - HORIZON) * s, s };
}

export function fitCanvas(cv, wrapEl) {
  const availW = Math.max(50, wrapEl.clientWidth);
  const availH = Math.max(50, wrapEl.clientHeight);
  const cssScale = Math.min(availW / W, availH / H);
  const cssW = Math.max(1, Math.floor(W * cssScale));
  const cssH = Math.max(1, Math.floor(H * cssScale));
  const dpr = window.devicePixelRatio || 1;
  const capDpr = Math.min(dpr, 2560 / cssW);
  const bufW = Math.max(1, Math.round(cssW * capDpr));
  const bufH = Math.max(1, Math.round(cssH * capDpr));
  if (cv.width !== bufW || cv.height !== bufH) {
    cv.width = bufW; cv.height = bufH;
    view.sceneryDirty = true; // canvas buffer reset drops GPU state; rebuild glow cache
  }
  if (cv.style.width !== cssW + "px") cv.style.width = cssW + "px";
  if (cv.style.height !== cssH + "px") cv.style.height = cssH + "px";
  view.scaleX = bufW / W; view.scaleY = bufH / H;
}

export function bindResize(cv, wrapEl) {
  addEventListener("resize", () => fitCanvas(cv, wrapEl));
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(() => fitCanvas(cv, wrapEl)).observe(wrapEl);
  }
}

function towerLines(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = Math.random();
    out.push(r < .16 ? pick(DIRS) : r < .38 ? pick(FILES) : r < .48 ? pick(PWS) : r < .62 ? pick(TAGS) : pick(SYS));
  }
  return out;
}

function makeTextTex(tw) {
  const c = document.createElement("canvas"); c.width = 240; c.height = Math.min(1000, tw.h);
  const g = c.getContext("2d"); g.font = "10px monospace"; g.fillStyle = PAL.web;
  for (let i = 0; i < Math.floor(c.height / 13); i++) {
    g.globalAlpha = .35 + Math.random() * .5;
    g.fillText(tw.lines[i % tw.lines.length].slice(0, 26), 3, 12 + i * 13);
  }
  tw.tex = c;
}

function bakeTrace(tr) {
  // Pre-project static trace geometry once per world so the hot loop does not remap P() per pulse.
  const pts = tr.pts.map(p => P(p[0], p[1]));
  tr.screen = pts;
  const segs = []; let total = 0;
  for (let i = 1; i < pts.length; i++) { const L = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); segs.push(L); total += L; }
  tr.segLen = segs; tr.totalLen = total;
}

export function genWorld() {
  worldGen++;
  towers = []; traces = []; pulses = [];
  const depths = [.06, .16, .27, .4, .55, .72, .9, 1];
  for (const side of [-1, 1]) {
    depths.forEach((t, i) => {
      const tw = {
        side, t,
        lat: side * (1.02 + Math.random() * .85),
        w: .34 + Math.random() * .3,
        h: (i >= depths.length - 3 ? 820 + Math.random() * 420 : 420 + Math.random() * 460),
        d: .06 + Math.random() * .05,
      };
      tw.lines = towerLines(30);
      makeTextTex(tw);
      towers.push(tw);
    });
  }
  towers.sort((a, b) => a.t - b.t);
  function bundle(lat, t0, t1, n) { const arr = []; for (let k = 0; k < n; k++) arr.push([lat + (k - (n - 1) / 2) * .022, t0, t1]); return arr; }
  traces = [];
  bundle(0, .02, 1, 3).forEach(b => traces.push({ pts: [[b[0], b[1]], [b[0], b[2]]], bus: true }));
  bundle(-.35, .05, 1, 3).forEach(b => traces.push({ pts: [[b[0], b[1]], [b[0], b[2]]], bus: true }));
  bundle(.35, .05, 1, 3).forEach(b => traces.push({ pts: [[b[0], b[1]], [b[0], b[2]]], bus: true }));
  for (let i = 0; i < 6; i++) {
    const pts = []; let lat = (Math.random() < .5 ? -1 : 1) * (.5 + Math.random() * .4), t = .03 + Math.random() * .2;
    pts.push([lat, t]);
    const bends = 2 + Math.floor(Math.random() * 3);
    for (let b = 0; b < bends; b++) {
      if (Math.random() < .55) { t = Math.min(.97, t + .28 + Math.random() * .45); }
      else { lat = Math.max(-1.05, Math.min(1.05, lat + (Math.random() < .5 ? -1 : 1) * (.22 + Math.random() * .4))); }
      pts.push([lat, t]);
    }
    if (t < .6) pts.push([lat, .72 + Math.random() * .25]);
    traces.push({ pts });
  }
  traces.forEach(bakeTrace);
  pulses = traces.map((_, i) => ({ tr: i, u: Math.random(), sp: .12 + Math.random() * .2 }));
  setHueShift((Math.floor(Math.random() * 5) - 2) * 14);
  view.sceneryDirty = true;
}

export function tracePoint(tr, u) {
  const pts = traces[tr].screen, segs = traces[tr].segLen, total = traces[tr].totalLen;
  let d = u * total;
  for (let i = 1; i < pts.length; i++) {
    if (d <= segs[i - 1]) {
      const f = d / (segs[i - 1] || 1);
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f, s: pts[i].s };
    }
    d -= segs[i - 1];
  }
  const l = pts[pts.length - 1]; return { x: l.x, y: l.y, s: l.s };
}

const scenery = document.createElement("canvas");
const sctx = scenery.getContext("2d");

export function buildScenery(cv) {
  scenery.width = cv.width; scenery.height = cv.height;
  const c = sctx;
  c.setTransform(view.scaleX, 0, 0, view.scaleY, 0, 0);
  c.fillStyle = "#000"; c.fillRect(0, 0, W, H);
  const vg = c.createRadialGradient(VPX, HORIZON, 2, VPX, HORIZON, 190);
  vg.addColorStop(0, "#0a2a3a"); vg.addColorStop(.4, PAL.web + "2a"); vg.addColorStop(1, "#0000");
  c.fillStyle = vg; c.fillRect(VPX - 190, HORIZON - 140, 380, 260);

  towers.forEach(tw => {
    const side = tw.side, fog = Math.max(.25, tw.t);
    const t2 = Math.max(.05, tw.t - tw.d);
    const nL = P(tw.lat - tw.w / 2, tw.t), nR = P(tw.lat + tw.w / 2, tw.t);
    const fL = P(tw.lat - tw.w / 2, t2), fR = P(tw.lat + tw.w / 2, t2);
    const wdt = nR.x - nL.x; if (wdt < 3) return;
    const gy = nL.y, topY = gy - tw.h * nL.s;
    const gyF = fL.y, topYF = gyF - tw.h * fL.s;
    const innerNear = side === -1 ? nR : nL, innerFar = side === -1 ? fR : fL;

    let fg = c.createLinearGradient(0, topY, 0, gy);
    fg.addColorStop(0, towerCol(PAL.web, .34 * fog)); fg.addColorStop(1, towerCol("#061520", .55 * fog));
    c.fillStyle = fg; c.fillRect(nL.x, topY, wdt, gy - topY);
    c.globalCompositeOperation = "lighter";
    c.globalAlpha = .75 * fog;
    c.drawImage(tw.tex, nL.x, topY, wdt, gy - topY);
    c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
    c.strokeStyle = towerCol(PAL.text, .5 * fog); c.lineWidth = 1;
    for (let pI = 0; pI < 2; pI++) {
      const px = nL.x + wdt * (.12 + pI * .45), pw2 = wdt * .3, py = topY + (gy - topY) * (.08 + pI * .4), ph2 = (gy - topY) * .18;
      c.globalAlpha = .5 * fog; c.strokeRect(px, py, pw2, ph2);
    }
    c.globalAlpha = 1;
    c.globalCompositeOperation = "lighter";
    c.strokeStyle = PAL.text; c.lineWidth = Math.max(.6, 2.2 * nL.s); c.globalAlpha = .9 * fog;
    c.shadowColor = PAL.web; c.shadowBlur = 8 * nL.s;
    c.strokeRect(nL.x, topY, wdt, gy - topY);
    c.beginPath(); c.moveTo(innerNear.x, gy); c.lineTo(innerNear.x, topY); c.stroke();
    c.beginPath();
    c.moveTo(nL.x, topY); c.lineTo(nR.x, topY); c.lineTo(fR.x, topYF); c.lineTo(fL.x, topYF);
    c.closePath();
    c.fillStyle = towerCol(PAL.text, .16 * fog); c.fill();
    c.beginPath();
    c.moveTo(innerNear.x, gy); c.lineTo(innerNear.x, topY);
    c.lineTo(innerFar.x, topYF); c.lineTo(innerFar.x, gyF);
    c.closePath();
    c.fillStyle = towerCol(PAL.web, .24 * fog); c.fill();
    c.strokeStyle = towerCol(PAL.web, .5 * fog); c.lineWidth = 1;
    for (let sI = 1; sI < 6; sI++) {
      const f = sI / 6;
      c.beginPath();
      c.moveTo(innerNear.x, topY + (gy - topY) * f);
      c.lineTo(innerFar.x, topYF + (gyF - topYF) * f);
      c.stroke();
    }
    const bf = c.createRadialGradient(innerNear.x, gy, 1, innerNear.x, gy, wdt * 1.4);
    bf.addColorStop(0, PAL.web + "66"); bf.addColorStop(1, "#0000");
    c.globalAlpha = .8 * fog; c.fillStyle = bf;
    c.beginPath(); c.ellipse(innerNear.x, gy, wdt * 1.4, wdt * .22, 0, 0, 7); c.fill();
    c.globalAlpha = 1; c.shadowBlur = 0; c.globalCompositeOperation = "source-over";
  });

  c.globalCompositeOperation = "lighter";
  traces.forEach(tr => {
    const pts = tr.screen;
    c.strokeStyle = tr.bus ? PAL.web : PAL.trace; c.globalAlpha = .22; c.lineWidth = 4;
    c.shadowColor = c.strokeStyle; c.shadowBlur = 9;
    c.beginPath(); pts.forEach((p, k) => k === 0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y)); c.stroke();
    c.globalAlpha = .85; c.lineWidth = 1.3; c.strokeStyle = "#bfefff";
    c.beginPath(); pts.forEach((p, k) => k === 0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y)); c.stroke();
    c.shadowBlur = 0; c.globalAlpha = 1;
  });
  c.globalCompositeOperation = "source-over";

  c.strokeStyle = PAL.web; c.lineWidth = 1;
  for (let i = 0; i < N; i++) {
    const lat = (i - (N - 1) / 2) * LANE_SP;
    const a = P(lat, .02), b2 = P(lat, 1);
    c.globalAlpha = .15; c.setLineDash([4, 9]);
    c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b2.x, b2.y); c.stroke();
  }
  c.setLineDash([]); c.globalAlpha = 1;
  view.sceneryDirty = false;
}

export function blitScenery(ctx, cv) {
  if (view.sceneryDirty) buildScenery(cv);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(scenery, 0, 0);
  ctx.setTransform(view.scaleX, 0, 0, view.scaleY, 0, 0);
}

genWorld();
