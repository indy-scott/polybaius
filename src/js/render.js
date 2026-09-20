// Frame composition: scenery blit, sprites, HUD string, start/game-over overlays.

import { W, H, CX } from "./constants.js";
import { PAL } from "./palettes.js";
import { muted } from "./audio.js";
import { getScores } from "./hiscores.js";
import { view, blitScenery, pulses, tracePoint } from "./world.js";
import { drawBug, drawPatch, drawPCBCannon } from "./entities.js";
import { state, mult } from "./game.js";
import { drawWarp } from "./warp.js";

export function drawStartOverlay(ctx, t) {
  if (state.titleView === "scores") { drawScoresScreen(ctx); return; }
  ctx.fillStyle = "rgba(0,4,10,.72)"; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.shadowColor = PAL.web; ctx.shadowBlur = 22;
  ctx.fillStyle = PAL.text; ctx.font = "42px monospace";
  ctx.fillText("POLYbAIUS", CX, H * .34);
  ctx.shadowBlur = 8;
  ctx.font = "12px monospace"; ctx.fillStyle = PAL.web;
  ctx.fillText("GIBSON MAINFRAME  ·  CORRIDOR DEFENSE", CX, H * .40);
  const pulse = .55 + .45 * Math.sin(t * 4);
  const bw = 240, bh = 42, bx = CX - bw / 2, by = H * .50;
  ctx.shadowBlur = 14 * pulse; ctx.strokeStyle = PAL.web; ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.globalAlpha = pulse; ctx.fillStyle = PAL.text; ctx.font = "14px monospace";
  ctx.fillText("CLICK TO START", CX, by + 27);
  ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  ctx.font = "13px monospace"; ctx.fillStyle = PAL.text; ctx.shadowColor = PAL.web; ctx.shadowBlur = 10;
  ctx.fillText("START LEVEL: " + (state.startLevel || 1), CX, H * .62);
  ctx.shadowBlur = 0;
  ctx.font = "10px monospace"; ctx.fillStyle = PAL.web;
  ctx.fillText("A / D  OR  ARROWS  TO  SELECT  (1-8)", CX, H * .66);
  ctx.fillText("M MUTE  ·  LEFT LASER  ·  RIGHT BOMB", CX, H * .72);
  ctx.font = "10px monospace"; ctx.fillStyle = PAL.text;
  ctx.fillText("H — HIGH SCORES", CX, H * .78);
  ctx.textAlign = "left";
}

// High-score screen, reachable from the title with H (Esc/H or click returns).
function drawScoresScreen(ctx) {
  ctx.fillStyle = "rgba(0,4,10,.8)"; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.shadowColor = PAL.web; ctx.shadowBlur = 16;
  ctx.fillStyle = PAL.text; ctx.font = "30px monospace";
  ctx.fillText("HIGH SCORES", CX, H * .18);
  ctx.shadowBlur = 0;
  const hs = getScores();
  if (!hs.length) {
    ctx.font = "13px monospace"; ctx.fillStyle = PAL.web;
    ctx.fillText("NO SCORES YET — BE THE FIRST", CX, H * .45);
  } else {
    ctx.font = "13px monospace"; ctx.fillStyle = PAL.text;
    ctx.fillText("RANK  INITIALS   SCORE     LEVEL", CX, H * .26);
    hs.forEach((r, i) => {
      ctx.fillStyle = i === 0 ? PAL.pad : PAL.text;
      ctx.fillText(
        String(i + 1).padStart(2, " ") + "    " +
        r.i.padEnd(3, ".") + "      " +
        String(r.s).padStart(7, " ") + "    L" + String(r.l).padStart(2, " "),
        CX, H * .32 + i * 26);
    });
  }
  ctx.font = "11px monospace"; ctx.fillStyle = PAL.web;
  ctx.fillText("H / ESC — BACK TO TITLE", CX, H * .88);
  ctx.textAlign = "left";
}

function drawGameOver(ctx) {
  const s = state;
  const hs = getScores();
  ctx.fillStyle = "rgba(0,4,10,.78)"; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.fillStyle = PAL.text; ctx.font = "20px monospace";
  ctx.fillText("ZOD BREACHED", CX, H * .28);
  if (s.overPhase === "entry") {
    ctx.font = "13px monospace";
    ctx.fillText("NEW HIGH SCORE — " + s.score + " — TYPE INITIALS, THEN ENTER", CX, H * .36);
    ctx.font = "34px monospace";
    const shown = (s.entryBuf + "..").slice(0, 3);
    ctx.fillText(shown.split("").join(" "), CX, H * .47);
    ctx.font = "10px monospace"; ctx.fillStyle = PAL.web;
    ctx.fillText("A-Z 0-9 · BACKSPACE · ENTER TO SAVE", CX, H * .55);
  } else {
    ctx.font = "13px monospace";
    ctx.fillText("FINAL SCORE " + s.score + " · LEVEL " + s.level, CX, H * .35);
    ctx.font = "11px monospace";
    ctx.fillText("— HIGH SCORES —", CX, H * .42);
    hs.forEach((r, i) => {
      ctx.fillStyle = r.s === s.score ? PAL.pad : PAL.text;
      ctx.fillText(`${String(i + 1).padStart(2, " ")}  ${r.i.padEnd(3, ".")}  ${String(r.s).padStart(7, " ")}  L${String(r.l).padStart(2, " ")}`, CX - 90, H * .46 + i * 18);
    });
    ctx.fillStyle = PAL.web; ctx.font = "10px monospace";
    ctx.fillText("CLICK OR ENTER TO CONTINUE", CX, H * .46 + hs.length * 18 + 14);
  }
  ctx.textAlign = "left";
}

export function hudString() {
  const s = state;
  const fx = [
    s.slowT > 0 ? `SLOW ${Math.round((1 - s.slowFactor) * 100)}% ${s.slowT.toFixed(0)}s` : null,
    s.rapidT > 0 ? "RAPID " + s.rapidT.toFixed(0) + "s" : null,
    s.shield ? "SHIELD" : "",
  ].filter(Boolean).join(" ");
  return `SCORE ${s.score}  ·  COMBO x${mult()} (${s.combo})  ·  STREAK ${s.streak}/bomb @${s.nextStreak}` +
    `  ·  BOMBS ${"●".repeat(s.bombs)}  ·  LIVES ${"●".repeat(Math.max(0, s.lives))}` +
    (fx ? `  ·  ${fx}` : "") +
    (s.phase === "warp" ? "  ·  WARP TO CORE" : "") +
    `  ·  LEVEL ${s.level} (${s.waveKills}/${s.waveNeed})  ·  ${muted ? "MUTED" : "SND ON [M]"}`;
}

export function drawFrame(ctx, cv, now) {
  const s = state;
  const t = now / 1000;
  ctx.setTransform(view.scaleX, 0, 0, view.scaleY, 0, 0);
  blitScenery(ctx, cv);

  ctx.globalCompositeOperation = "lighter";
  pulses.forEach((p, i) => {
    const q = tracePoint(i, p.u);
    ctx.fillStyle = PAL.pad; ctx.shadowColor = PAL.pad;
    ctx.shadowBlur = q.s > 0.6 ? 10 : 0; // far pulses are 2px dots; blur does not read
    ctx.beginPath(); ctx.arc(q.x, q.y, 2.4 * q.s + .6, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  });
  ctx.globalCompositeOperation = "source-over";

  if (s.phase === "warp") drawWarp(ctx, s, now);
  else {
    s.bugs.sort((a, b) => a.t - b.t).forEach(b => drawBug(ctx, b.x, b.y, (.45 + b.t * 1.05) * b.s * 1.9, b.type, t + b.ph, PAL.bug[b.type]));
    s.patches.sort((a, b) => a.t - b.t).forEach(p => drawPatch(ctx, p.x, p.y, p.s * 1.9, p.type));
  }

  ctx.globalCompositeOperation = "lighter";
  s.shots.forEach(sh => {
    ctx.strokeStyle = PAL.pad; ctx.globalAlpha = .4; ctx.lineWidth = 5.5;
    ctx.beginPath(); ctx.moveTo(sh.x - sh.vx * .035, sh.y - sh.vy * .035); ctx.lineTo(sh.x, sh.y); ctx.stroke();
    const g = ctx.createLinearGradient(sh.x - sh.vx * .03, sh.y - sh.vy * .03, sh.x, sh.y);
    g.addColorStop(0, PAL.pad + "00"); g.addColorStop(1, "#eaffff");
    ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.moveTo(sh.x - sh.vx * .035, sh.y - sh.vy * .035); ctx.lineTo(sh.x, sh.y); ctx.stroke();
  });
  s.parts.forEach(p => { ctx.globalAlpha = p.life * 2; ctx.fillStyle = p.col; ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); });
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  drawPCBCannon(ctx, s.cannonScreen.x, s.cannonScreen.y);
  if (s.started && !s.gameOver) {
    ctx.strokeStyle = PAL.text; ctx.shadowColor = PAL.text; ctx.shadowBlur = 6; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(s.mouse.x, s.mouse.y, 9, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s.mouse.x - 14, s.mouse.y); ctx.lineTo(s.mouse.x - 5, s.mouse.y);
    ctx.moveTo(s.mouse.x + 5, s.mouse.y); ctx.lineTo(s.mouse.x + 14, s.mouse.y);
    ctx.moveTo(s.mouse.x, s.mouse.y - 14); ctx.lineTo(s.mouse.x, s.mouse.y - 5);
    ctx.moveTo(s.mouse.x, s.mouse.y + 5); ctx.lineTo(s.mouse.x, s.mouse.y + 14); ctx.stroke();
    ctx.shadowBlur = 0;
  }
  if (s.bombFx > 0) { ctx.globalAlpha = s.bombFx * .35; ctx.fillStyle = PAL.pad; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (s.flash > 0) { ctx.globalAlpha = s.flash * .3; ctx.fillStyle = "#ff2244"; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (s.gameOver) drawGameOver(ctx);
  if (!s.started) drawStartOverlay(ctx, t);
}
