// Six selectable palettes. Gibson Cyan is the default (D2). Patch colors are
// fixed on each disk type and do not follow the palette (D15).

export const PALETTES = [
  { name: "GIBSON CYAN (default)", web: "#00e5ff", text: "#7df9ff", pad: "#ffd24a", trace: "#ff4fd8",
    bug: { rootkit: "#ff3366", voltworm: "#ffe14a", tanglebug: "#ffffff", hive: "#b26bff" } },
  { name: "TOXIC TERMINAL", web: "#39ff6a", text: "#aaffc3", pad: "#ffd24a", trace: "#ff4fd8",
    bug: { rootkit: "#ff4fd8", voltworm: "#ffe14a", tanglebug: "#ffffff", hive: "#b26bff" } },
  { name: "VIOLET FLUX", web: "#b26bff", text: "#e0c2ff", pad: "#ffd24a", trace: "#39ff6a",
    bug: { rootkit: "#ff4fd8", voltworm: "#ffd24a", tanglebug: "#ffffff", hive: "#39ff6a" } },
  { name: "AMBER MAINFRAME", web: "#ffb000", text: "#ffd48a", pad: "#39ff6a", trace: "#00e5ff",
    bug: { rootkit: "#ff3366", voltworm: "#7df9ff", tanglebug: "#ffffff", hive: "#b26bff" } },
  { name: "GLACIER ICE", web: "#9fd8ff", text: "#e8f7ff", pad: "#b26bff", trace: "#ff4fd8",
    bug: { rootkit: "#ff3366", voltworm: "#ffb000", tanglebug: "#ffffff", hive: "#ff4fd8" } },
  { name: "RED ALERT", web: "#ff3355", text: "#ff9aa8", pad: "#ffd24a", trace: "#ffe14a",
    bug: { rootkit: "#b26bff", voltworm: "#ffe14a", tanglebug: "#ffffff", hive: "#39ff6a" } },
];

export let PAL = PALETTES[0];
export let hueShift = 0;

export function setPalette(p) { PAL = p; }
export function setHueShift(deg) { hueShift = deg; }

export function hue(hex, deg) {
  const n = parseInt(hex.slice(1), 16); let r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0;
  if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  h = (h + deg + 360) % 360; const s = mx ? d / mx : 0, v = mx;
  const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
  let R, G, B;
  if (h < 60) { R = c; G = x; B = 0; } else if (h < 120) { R = x; G = c; B = 0; } else if (h < 180) { R = 0; G = c; B = x; }
  else if (h < 240) { R = 0; G = x; B = c; } else if (h < 300) { R = x; G = 0; B = c; } else { R = c; G = 0; B = x; }
  const to = v => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return "#" + to(R) + to(G) + to(B);
}

export function towerCol(base, alpha) {
  return hue(base, hueShift) + Math.round(alpha * 255).toString(16).padStart(2, "0");
}
