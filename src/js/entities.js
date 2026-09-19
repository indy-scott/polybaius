// Neon wireframe bugs with a dark underlay halo (D8), floppy patches (D15),
// and the PCB cannon (D9). Drawing only: simulation lives in game.js.

import { PAL } from "./palettes.js";

export function drawBug(ctx, x, y, s, type, t, col) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const paint = (c, fill, lw, blur) => {
    ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = lw;
    ctx.shadowColor = c; ctx.shadowBlur = blur;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const side = i < 3 ? -1 : 1, k = i % 3, bx = (k - 1) * 6, by = side * 3;
      ctx.moveTo(bx, by); ctx.lineTo(bx + Math.sin(t * 9 + i * 2) * 2, by + side * (4 + k));
      ctx.lineTo(bx + Math.sin(t * 9 + i * 2) * 2 + Math.sin(t * 9 + i) * 3, by + side * (8 + k));
    }
    ctx.stroke();
    if (type === "rootkit") {
      const f = Math.sin(t * 6) * 3;
      ctx.beginPath();
      ctx.moveTo(-9, -2 + f); ctx.lineTo(0, 3); ctx.lineTo(-9, 8 + f); ctx.closePath();
      ctx.moveTo(9, -2 - f); ctx.lineTo(0, 3); ctx.lineTo(9, 8 - f); ctx.closePath();
      if (fill) { ctx.globalAlpha = .85; ctx.fill(); ctx.globalAlpha = 1; }
      ctx.stroke();
    } else if (type === "voltworm") {
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += .3) {
        const r = 5 + Math.sin(a * 3 + t * 7) * 2;
        a === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r * .8) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * .8);
      }
      ctx.closePath();
      if (fill) { ctx.globalAlpha = .45; ctx.fill(); ctx.globalAlpha = 1; }
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 2.2, 0, 7); ctx.fill();
    } else if (type === "tanglebug") {
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const a = i / 7 * Math.PI * 2; ctx.moveTo(Math.cos(a) * 3, Math.sin(a) * 3);
        ctx.lineTo(Math.cos(a) * (7 + Math.sin(t * 9 + i) * 2), Math.sin(a) * (7 + Math.sin(t * 9 + i) * 2));
      }
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 4, 0, 7);
      if (fill) { ctx.globalAlpha = .9; ctx.fill(); ctx.globalAlpha = 1; }
      ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(6, 0); ctx.lineTo(0, 7); ctx.lineTo(-6, 0); ctx.closePath();
      if (fill) { ctx.globalAlpha = .5; ctx.fill(); ctx.globalAlpha = 1; }
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(0, -3); ctx.lineTo(3, 0); ctx.lineTo(0, 3); ctx.closePath(); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(-2, -4); ctx.lineTo(-4 + Math.sin(t * 9), -9);
    ctx.moveTo(2, -4); ctx.lineTo(4 + Math.sin(t * 9 + 2), -9); ctx.stroke();
  };
  paint("rgba(0,0,0,.85)", false, 5.5 / s, 0);  // underlay: thick dark stroke already contrasts; skip shadowBlur
  // neon glow only on near sprites: far ones are tiny and shadowBlur is wasted GPU fill
  paint(col, true, 2.2 / s, s > 1.2 ? 10 / s : 0);
  ctx.restore();
}

export function drawPatch(ctx, x, y, s, type) {
  const col = type.col;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.6 / s;
  ctx.shadowColor = col; ctx.shadowBlur = s > 0.8 ? 10 / s : 0; // skip glow on distant chips
  ctx.translate(0, Math.sin(performance.now() / 300) * 1.5 / s);
  ctx.strokeRect(-8, -8, 16, 16);
  ctx.strokeRect(-4.5, -8, 9, 5);
  ctx.fillStyle = col; ctx.fillRect(-1, -4.5, 2, 2.5);
  ctx.beginPath(); ctx.rect(-6, 0, 12, 6.5); ctx.stroke();
  ctx.fillStyle = col; ctx.font = "4px monospace"; ctx.textAlign = "center";
  ctx.fillText(type.id, 0, 5.2); ctx.textAlign = "left";
  ctx.restore();
}

export function drawPCBCannon(ctx, x, y) {
  ctx.save(); ctx.translate(x, y);
  const A = PAL.pad, AC = PAL.web;
  ctx.shadowColor = A; ctx.shadowBlur = 12; ctx.lineWidth = 2; ctx.strokeStyle = AC;
  ctx.strokeRect(-16, -12, 32, 24);
  ctx.fillStyle = A;
  [[-11, -6], [-11, 8], [11, -6], [11, 8]].forEach(p => ctx.fillRect(p[0] - 2.5, p[1] - 2.5, 5, 5));
  ctx.beginPath(); ctx.arc(0, 2, 6.5, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 2, 2, 0, 7); ctx.fillStyle = AC; ctx.fill();
  ctx.strokeStyle = A; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(0, -24); ctx.stroke();
  ctx.fillStyle = A; ctx.fillRect(-3.5, -29, 7, 7);
  ctx.restore();
}
