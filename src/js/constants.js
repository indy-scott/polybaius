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
