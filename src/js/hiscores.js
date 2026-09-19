// Arcade top-10 in localStorage only (D3, D12). Key matches v5 so scores
// carry over from the sample when served from the same origin.

const HS_KEY = "polybaius.hiscores";

let hs = [];
try { hs = JSON.parse(localStorage.getItem(HS_KEY) || "[]"); } catch (e) { hs = []; }

export function getScores() { return hs; }

export function qualifies(s) {
  return s > 0 && (hs.length < 10 || s > hs[hs.length - 1].s);
}

export function saveScore(initials, score, level) {
  hs.push({ i: initials, s: score, l: level });
  hs.sort((a, b) => b.s - a.s); hs = hs.slice(0, 10);
  try { localStorage.setItem(HS_KEY, JSON.stringify(hs)); } catch (e) { /* quota / private mode */ }
}
