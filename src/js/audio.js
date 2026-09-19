// WebAudio procedural synth (D5). No audio files. Oscillators are cheap and
// we resume the context on first start (browsers block audio until a gesture).

let AC = null;
export let muted = false;

export function audio() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  return AC;
}

export function toggleMute() { muted = !muted; }

function beep(f0, f1, dur, type, vol) {
  if (muted) return;
  try {
    const a = audio(), o = a.createOscillator(), g = a.createGain();
    o.type = type || "square"; o.frequency.setValueAtTime(f0, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), a.currentTime + dur);
    g.gain.setValueAtTime(vol || .08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + dur);
    o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + dur);
  } catch (e) { /* autoplay / closed context */ }
}

export const sfx = {
  laser: () => beep(880, 140, .09, "sawtooth", .05),
  hit: () => beep(200, 900, .12, "square", .07),
  bomb: () => beep(120, 40, .5, "sawtooth", .12),
  breach: () => beep(300, 60, .3, "square", .1),
  bombAward: () => beep(500, 1000, .15, "triangle", .08),
  patch: () => { beep(600, 1200, .1, "triangle", .08); setTimeout(() => beep(900, 1500, .1, "triangle", .07), 90); },
};
