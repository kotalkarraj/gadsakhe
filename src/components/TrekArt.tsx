/**
 * Generative ridge-line artwork used whenever a trek has no photo yet.
 * Fully deterministic from `seed` (the trek slug), so each trek always
 * gets the same layered Sahyadri silhouette, sun and fort on a peak.
 */

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 400;
const H = 300;

function ridge(rand: () => number, base: number, amp: number, steps: number) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W;
    const y = base - rand() * amp;
    pts.push([x, y]);
  }
  // Smooth with quadratic curves through midpoints
  let d = `M 0 ${H} L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    d += ` Q ${px} ${py} ${(px + x) / 2} ${(py + y) / 2}`;
  }
  d += ` L ${W} ${pts[pts.length - 1][1]} L ${W} ${H} Z`;
  return { d, pts };
}

const LAYERS = ["#9cc4a4", "#5f8f6c", "#2f5a40", "#16261d"];

export default function TrekArt({
  seed,
  className = "",
}: {
  seed: string;
  className?: string;
}) {
  const rand = rng(seed);
  const sunX = 80 + rand() * 240;
  const sunY = 70 + rand() * 50;
  const hue = rand() > 0.5 ? "#e9d9a6" : "#f1c9a0";

  const layers = LAYERS.map((fill, i) => ({
    fill,
    ...ridge(rand, 170 + i * 32, 60 - i * 6, 6 + i * 2),
  }));

  // Perch a small fort on the highest point of the second-from-front ridge
  const fortLayer = layers[2];
  const peak = fortLayer.pts
    .slice(1, -1)
    .reduce((a, b) => (b[1] < a[1] ? b : a));
  const fx = peak[0];
  const fy = peak[1] + 6;

  const id = `sky-${seed}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c3326" />
          <stop offset="60%" stopColor="#6f9a7c" />
          <stop offset="100%" stopColor={hue} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
      <circle cx={sunX} cy={sunY} r="26" fill={hue} opacity="0.9" />
      <circle cx={sunX} cy={sunY} r="48" fill={hue} opacity="0.15" />
      {layers.map((l, i) => (
        <g key={i}>
          <path d={l.d} fill={l.fill} />
          {i === 2 && (
            <g fill={l.fill}>
              <rect x={fx - 22} y={fy - 14} width="44" height="16" />
              {[-22, -13, -4, 5, 14].map((dx) => (
                <rect key={dx} x={fx + dx} y={fy - 20} width="6" height="7" />
              ))}
              <rect x={fx - 4} y={fy - 30} width="8" height="18" />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}
