// Bootstrap: DOM chrome, input, rAF loop, ?photo capture mode.
//
// ES modules: each file below `export`s names; this file `import`s them. The
// browser fetches each .js by URL. No bundler (D7). Serve over http://
// (python3 -m http.server) — file:// blocks module loads.

import { W, H, CX, PATCH_TYPES } from "./constants.js";
import { PALETTES, setPalette } from "./palettes.js";
import { toggleMute } from "./audio.js";
import { saveScore } from "./hiscores.js";
import { view, fitCanvas, bindResize } from "./world.js";
import {
  state, beginPlay, returnToTitle, fireLaser, dropBomb, tick,
} from "./game.js";
import { drawFrame, hudString } from "./render.js";

const cv = document.getElementById("cv");
const ctx = cv.getContext("2d");
const wrapEl = document.getElementById("wrap");
const hudEl = document.getElementById("hud");
const palsDiv = document.getElementById("pals");

PALETTES.forEach((p, i) => {
  const d = document.createElement("span"); d.className = "pal" + (i ? "" : " sel"); d.style.color = p.web;
  d.textContent = p.name;
  d.onclick = () => {
    setPalette(p);
    document.querySelectorAll(".pal").forEach(x => x.classList.remove("sel"));
    d.classList.add("sel");
    view.sceneryDirty = true;
  };
  palsDiv.appendChild(d);
});

cv.addEventListener("mousemove", e => {
  const r = cv.getBoundingClientRect();
  state.mouse.x = (e.clientX - r.left) * (W / r.width);
  state.mouse.y = (e.clientY - r.top) * (H / r.height);
});
cv.addEventListener("mousedown", e => {
  if (!state.started) { if (state.titleCool > 0) return; beginPlay(); return; }
  if (state.gameOver) { if (state.overPhase === "table") returnToTitle(); return; }
  if (e.button === 0) fireLaser();
  if (e.button === 2) dropBomb();
});
cv.addEventListener("contextmenu", e => e.preventDefault());

addEventListener("keydown", e => {
  if (e.code === "KeyM") toggleMute();
  if (!state.started) {
    if (state.titleCool > 0) return;
    if (e.code === "Enter" || e.code === "Space") { e.preventDefault(); beginPlay(); }
    return;
  }
  if (state.gameOver && state.overPhase === "entry") {
    if (/^[a-zA-Z0-9]$/.test(e.key) && state.entryBuf.length < 3) { state.entryBuf += e.key.toUpperCase(); }
    else if (e.code === "Backspace") { state.entryBuf = state.entryBuf.slice(0, -1); }
    else if (e.code === "Enter" && state.entryBuf.length > 0) {
      saveScore(state.entryBuf, state.score, state.level); state.overPhase = "table";
    }
  } else if (state.gameOver && state.overPhase === "table" && (e.code === "Enter" || e.code === "Space")) {
    e.preventDefault(); returnToTitle();
  }
});

let lastHud = "";
let last = performance.now();
function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  tick(dt, now);
  drawFrame(ctx, cv, now);
  const hudStr = hudString();
  if (hudStr !== lastHud) { lastHud = hudStr; hudEl.textContent = hudStr; }
  if (!window.PHOTO) requestAnimationFrame(loop);
}

// Probe surface for headless checks (v5 hung these on the window as globals).
window.PolybAIus = { state, view, beginPlay, returnToTitle, fireLaser, dropBomb };

if (location.search.includes("photo")) {
  document.body.style.padding = "0";
  ["h1", ".sub", "#pals", "#hud"].forEach(sel => document.querySelectorAll(sel).forEach(e => { e.style.display = "none"; }));
  state.cannonYOff = -42; // lift cannon into frame for the shot
  state.spawnT = 99999; state.patchT = 99999;
  [["rootkit", .45, 3], ["voltworm", .62, 4], ["tanglebug", .78, 3], ["hive", .9, 5],
    ["rootkit", .3, 6], ["voltworm", .5, 7], ["tanglebug", .66, 1]].forEach((d, i) => {
    state.bugs.push({ lane: d[2], t: d[1], type: d[0], ph: i * 1.3, x: 0, y: 0 });
  });
  state.patches.push({ lane: 2, t: .55, ph: 0, x: 0, y: 0, type: PATCH_TYPES[0] });
  state.patches.push({ lane: 6, t: .4, ph: 2, x: 0, y: 0, type: PATCH_TYPES[1] });
  state.patches.push({ lane: 4, t: .28, ph: 4, x: 0, y: 0, type: PATCH_TYPES[3] });
  state.score = 4850; state.combo = 7; state.streak = 9; state.bombs = 3; state.lives = 3;
  state.level = 3; state.waveKills = 4; state.waveNeed = 11; state.totalKills = 58;
  state.shots.push({ x: CX, y: H * .72, px: CX - 5, py: H * .76, vx: 0, vy: -1500 });
  window.PHOTO = true;
  state.started = true; // skip the title overlay so the capture is a full in-game frame
  // Modules are deferred: wrap has no layout yet at evaluate-time (clientWidth=0).
  // Fit inside the existing 300ms capture delay so the backing store matches the window.
  setTimeout(function () {
    fitCanvas(cv, wrapEl);
    last = performance.now();
    for (var i = 0; i < 10; i++) loop(last + i * 16.7);
  }, 300);
}
if (!location.search.includes("photo")) {
  bindResize(cv, wrapEl);
  fitCanvas(cv, wrapEl);
  requestAnimationFrame(loop);
}
