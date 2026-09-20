// Logical board size. All game math lives in this 900x640 space; the canvas
// backing store may be larger on HiDPI (see world.fitCanvas). D17 / v0.1.2.
export const W = 900;
export const H = 640;
export const CX = W / 2;
export const HORIZON = H * .52;
export const FLOOR = H - 6;
export const VPX = CX;

export const N = 8;
export const LANE_SP = .12;

// Shortened cannon barrel tip, pixels above cannonScreen. Laser origin and
// aim vector both use this so bolts leave the muzzle, not the turret body.
export const MUZZLE_Y = 18;

export const BASE = { rootkit: 100, voltworm: 150, tanglebug: 200, hive: 250 };

export const PATCH_TYPES = [
  { id: "S1", col: "#39ff6a", drift: .45, slow: .75 },
  { id: "S2", col: "#ffe14a", drift: 1.0, slow: .60 },
  { id: "S3", col: "#ff4fd8", drift: 1.9, slow: .40 },
  { id: "RAP", col: "#7df9ff", drift: 1.0 },
  { id: "SHL", col: "#b26bff", drift: .8 },
  { id: "BMB", col: "#ffffff", drift: 1.2 },
];
export const PATCH_POOL = [
  PATCH_TYPES[0], PATCH_TYPES[0],
  PATCH_TYPES[1], PATCH_TYPES[1],
  PATCH_TYPES[2], PATCH_TYPES[3], PATCH_TYPES[4], PATCH_TYPES[5],
];

export const DIRS = [
  "/usr/lib/zod", "/var/spool/attack", "/etc/zod.d", "/home/acidburn",
  "/opt/gibson", "/proc/1337", "/mnt/crypt", "/srv/ice", "/boot/kernel",
  "/var/log/sect", "/root/.ssh", "/dev/zod0",
];
export const FILES = [
  "knight.log", "acid_burn.pw", "garbage.asm", "razor.conf", "cerebal.sock",
  "phantom.phk", "zero_cool.deb", "crash_override.sh", "theplague.key",
  "da_vinci.tar.gz", "limbo.rc", "youdontexist.bin", "return.log", "void.log",
  "HTTP.log", "aes.log",
];
export const PWS = [
  "hunter2", "swordfish", "Tr0ub4dor&3", "correct-horse-battery", "ZODmaster!",
  "p4ssw0rd", "s3cur3-1c3", "4451", "acid^burn", "CEREAL_KILLER",
];
export const SYS = [
  "systemd[1]: Started Gibson Firewall.", "netstat: TCP ESTABLISHED :443",
  "sshd: attack from 10.10.10.66", "[ OK ] Mounted /dev/zod0",
  "segfault at 0xdeadbeef ip 0x0000c0de", "top - 04:21:01 up 666 days",
  "crond: JOB 66 run every 5m", "chmod 000 /var/log/audit",
  "iptables -A INPUT -j DROP", "tar -xzf zod_core.tar.gz",
  "dmesg: wireway link UP 10Gbps", "-----BEGIN RSA PRIVATE KEY-----",
  "hexdump: BF B2 02 E4 1F 18 CF 31", "whoami: zero_cool (uid=31337)",
  "ps aux | grep gibson", "[ OK ] Starting OpenBSD Secure Shell...",
];
export const TAGS = [
  "[ERROR]", "[FATAL]", ">>>OVERRIDE", ">DUMPSEG", "[TRACE]", "[ ALERT ]",
  "00000x0110x", "11100110x01", "SEG#0x3F", "[ACK]", "[NAK]",
];

export const pick = a => a[Math.floor(Math.random() * a.length)];

// ---------------------------------------------------------------------------
// DIFF - single source of truth for the slow-burn curve (D16).
//
// Competent player model: ~1 kill per spawn, 3 lives, bombs used to recover.
// Time-to-K is roughly the integral of spawnInterval(k) dk (each spawn killed).
//
//   kills   ~time    speed   travel   spawn    mix
//      0    0:00     0.048    ~21s    2.40s    rootkit only
//    ~50    2:00     0.076    ~13s    2.23s    +voltworm @ 40     first 2 min calm
//   ~140    5:00     0.125     ~8s    1.91s    +tangle @ 80
//   ~230    7:00     0.175     ~6s    1.60s    +hive @ 180        mid compounding
//   ~330   10:00     0.230     ~4s    1.25s    all types
//   ~540   13:10     0.345    ~2.9s   0.51s    approaching cap
//   ~567   13:20     0.360    ~2.8s   0.50s    HARD CAP
//   567+   13-25m    capped   ~2.8s   0.50s    lives drain on the cap
//
// Cap hardness matches the previous ceiling (speed 0.36 vs 0.365, spawn floor
// 0.50 vs 0.55) so this is a reshape: slower early, same late bite. Projected
// death for a solid player lands in the 15-25 minute band.
//
// Skill-step seeds totalKills from START_KILLS[level] so start-N is that
// point on the SAME curve. Wave quota also grows with level. Score-per-kill
// is unchanged (player just accepts a harder baseline).
// ---------------------------------------------------------------------------
export const DIFF = {
  SPEED_BASE: 0.048,
  SPEED_PER_KILL: 0.00055,
  SPEED_CAP: 0.36,

  SPAWN_BASE: 2.40,
  SPAWN_PER_KILL: 0.0035,
  SPAWN_FLOOR: 0.50,

  WAVE_BASE: 8,
  WAVE_GROWTH: 3,            // L1=8, L5=20, L8=29

  PATCH_MIN: 10,
  PATCH_SPAN: 8,             // next patch in 10-18s

  MIX_VOLT: 40,
  MIX_TANGLE: 80,
  MIX_HIVE: 180,

  START_MIN: 1,
  START_MAX: 8,
  // index = start level. L5 = mid-game, L8 = on the cap.
  START_KILLS: [0, 0, 35, 85, 150, 230, 330, 440, 560],

  TRACE_SCORE: 50,           // small points for shooting a corrupted trace
  WARP_DURATION: 3.5,
  WARP_TRACE_MIN: 7,
  WARP_TRACE_PER_LEVEL: 1,
  WARP_TRACE_MAX: 14,
};

export function rampSpeed(kills, slowFactor) {
  const extra = Math.min(DIFF.SPEED_CAP - DIFF.SPEED_BASE, kills * DIFF.SPEED_PER_KILL);
  return (DIFF.SPEED_BASE + extra) * (slowFactor == null ? 1 : slowFactor);
}

export function spawnInterval(kills) {
  return Math.max(DIFF.SPAWN_FLOOR, DIFF.SPAWN_BASE - kills * DIFF.SPAWN_PER_KILL);
}

export function waveNeedFor(level) {
  return DIFF.WAVE_BASE + Math.max(0, level - 1) * DIFF.WAVE_GROWTH;
}

export function mixCount(kills) {
  if (kills > DIFF.MIX_HIVE) return 4;
  if (kills > DIFF.MIX_TANGLE) return 3;
  if (kills > DIFF.MIX_VOLT) return 2;
  return 1;
}

export function nextPatchDelay() {
  return DIFF.PATCH_MIN + Math.random() * DIFF.PATCH_SPAN;
}

export function killsForStartLevel(n) {
  const i = Math.max(DIFF.START_MIN, Math.min(DIFF.START_MAX, n | 0));
  return DIFF.START_KILLS[i];
}

export const MIX_TYPES = ["rootkit", "voltworm", "tanglebug", "hive"];
