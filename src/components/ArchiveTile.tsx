import type { ArchiveItem } from '../data/archive';

type Variant = { bg: string; fg: string; accent: string };

const VARIANTS: Variant[] = [
  // 0: red on paper
  { bg: '#F4EFE6', fg: '#8B1A1A', accent: '#0A0A0A' },
  // 1: paper on black
  { bg: '#0A0A0A', fg: '#F4EFE6', accent: '#E85D5D' },
  // 2: paper on red
  { bg: '#8B1A1A', fg: '#F4EFE6', accent: '#0A0A0A' },
];

// Small deterministic hash from a slug for stable variation within a template
function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Template 0: large X mark
function TileX({ v }: { v: Variant }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <rect width="100" height="100" fill={v.bg} />
      <line x1="18" y1="18" x2="82" y2="82" stroke={v.fg} strokeWidth="10" strokeLinecap="square" />
      <line x1="82" y1="18" x2="18" y2="82" stroke={v.fg} strokeWidth="10" strokeLinecap="square" />
    </svg>
  );
}

// Template 1: percentage circle
function TilePercent({ v, n }: { v: Variant; n: number }) {
  const pct = 30 + (n % 60);
  const r = 32;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <rect width="100" height="100" fill={v.bg} />
      <circle cx="50" cy="50" r={r} fill="none" stroke={v.fg} strokeOpacity="0.3" strokeWidth="6" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke={v.fg} strokeWidth="6"
        strokeDasharray={`${dash} ${c - dash}`}
        transform="rotate(-90 50 50)"
        strokeLinecap="butt"
      />
      <text x="50" y="55" textAnchor="middle" fontFamily="JetBrains Mono, monospace"
            fontSize="14" fontWeight="700" fill={v.fg}>{pct}%</text>
    </svg>
  );
}

// Template 2: massive 404
function Tile404({ v }: { v: Variant }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <rect width="100" height="100" fill={v.bg} />
      <text x="50" y="62" textAnchor="middle" fontFamily="Archivo, sans-serif"
            fontSize="38" fontWeight="900" fill={v.fg} letterSpacing="-2">404</text>
    </svg>
  );
}

// Template 3: single big letter / glyph
function TileLetter({ v, n, fallback }: { v: Variant; n: number; fallback?: string }) {
  const glyphs = ['K', 'A', 'β', '✕', '→', '◐', '∞', 'Ω'];
  const ch = fallback ?? glyphs[n % glyphs.length];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <rect width="100" height="100" fill={v.bg} />
      <text x="50" y="72" textAnchor="middle" fontFamily="Archivo, sans-serif"
            fontSize="78" fontWeight="900" fill={v.fg}>{ch}</text>
    </svg>
  );
}

// Template 4: barcode (vertical bars with algorithmic widths)
function TileBarcode({ v, n }: { v: Variant; n: number }) {
  const bars: { x: number; w: number }[] = [];
  let x = 8;
  let seed = n;
  while (x < 92) {
    seed = (seed * 9301 + 49297) % 233280;
    const w = 1 + (seed % 5);
    bars.push({ x, w });
    x += w + 2;
  }
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <rect width="100" height="100" fill={v.bg} />
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="20" width={b.w} height="60" fill={v.fg} />
      ))}
      <text x="50" y="92" textAnchor="middle" fontFamily="JetBrains Mono, monospace"
            fontSize="6" fill={v.fg}>0{n.toString().padStart(2, '0')}{n.toString(16)}</text>
    </svg>
  );
}

// Template 5: nested geometric weave
function TileWeave({ v, n }: { v: Variant; n: number }) {
  const rings = 5 + (n % 3);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <rect width="100" height="100" fill={v.bg} />
      {Array.from({ length: rings }).map((_, i) => {
        const inset = (i + 1) * (40 / rings);
        return (
          <rect key={i} x={inset} y={inset} width={100 - inset * 2} height={100 - inset * 2}
                fill="none" stroke={v.fg} strokeWidth="1" />
        );
      })}
      <polygon points="50,15 85,85 15,85" fill="none" stroke={v.fg} strokeWidth="1.5" />
    </svg>
  );
}

// Template 6: halftone radial (concentric dot grid fading inward)
function TileHalftone({ v }: { v: Variant }) {
  const dots: { x: number; y: number; r: number }[] = [];
  const step = 8;
  for (let y = step; y < 100; y += step) {
    for (let x = step; x < 100; x += step) {
      const dx = x - 50;
      const dy = y - 50;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const r = Math.max(0.4, Math.min(3.2, dist / 18));
      dots.push({ x, y, r });
    }
  }
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <rect width="100" height="100" fill={v.bg} />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={v.fg} />
      ))}
    </svg>
  );
}

// Template 7: sun rays
function TileSunRays({ v, n }: { v: Variant; n: number }) {
  const count = 10 + (n % 3);
  const rays = Array.from({ length: count }).map((_, i) => {
    const ang = (i / count) * Math.PI * 2;
    return {
      x2: 50 + Math.cos(ang) * 60,
      y2: 50 + Math.sin(ang) * 60,
    };
  });
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <rect width="100" height="100" fill={v.bg} />
      {rays.map((r, i) => (
        <line key={i} x1="50" y1="50" x2={r.x2} y2={r.y2} stroke={v.fg} strokeWidth="2" />
      ))}
      <circle cx="50" cy="50" r="8" fill={v.fg} />
    </svg>
  );
}

// Template 8: checkerboard
function TileChecker({ v, n }: { v: Variant; n: number }) {
  const grid = (n % 2 === 0) ? 4 : 8;
  const cell = 100 / grid;
  const cells: JSX.Element[] = [];
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      if ((x + y) % 2 === 0) {
        cells.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill={v.fg} />);
      }
    }
  }
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <rect width="100" height="100" fill={v.bg} />
      {cells}
    </svg>
  );
}

// Template 9: build / break / ship horizontal text bands
function TileBands({ v }: { v: Variant }) {
  const labels = ['BUILD', 'BREAK', 'SHIP'];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <rect width="100" height="100" fill={v.bg} />
      {labels.map((label, i) => (
        <g key={i}>
          <rect x="0" y={i * 33.3 + 1} width="100" height="32" fill={i % 2 === 0 ? v.fg : 'transparent'} />
          <text x="50" y={i * 33.3 + 22} textAnchor="middle" fontFamily="Archivo, sans-serif"
                fontSize="14" fontWeight="900" fill={i % 2 === 0 ? v.bg : v.fg}>{label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function ArchiveTile({ item, index }: { item: ArchiveItem; index: number }) {
  const v = VARIANTS[index % 3];
  const tpl = index % 10;
  const seed = hashSlug(item.slug);
  const fallbackChar = item.name.replace(/[^A-Z0-9]/g, '').charAt(0) || '·';

  let svg: JSX.Element;
  switch (tpl) {
    case 0: svg = <TileX v={v} />; break;
    case 1: svg = <TilePercent v={v} n={seed} />; break;
    case 2: svg = <Tile404 v={v} />; break;
    case 3: svg = <TileLetter v={v} n={seed} />; break;
    case 4: svg = <TileBarcode v={v} n={seed} />; break;
    case 5: svg = <TileWeave v={v} n={seed} />; break;
    case 6: svg = <TileHalftone v={v} />; break;
    case 7: svg = <TileSunRays v={v} n={seed} />; break;
    case 8: svg = <TileChecker v={v} n={seed} />; break;
    case 9: svg = <TileBands v={v} />; break;
    default: svg = <TileLetter v={v} n={seed} fallback={fallbackChar} />;
  }

  return (
    <div className="w-full aspect-square relative overflow-hidden mb-3" aria-hidden="true">
      {svg}
    </div>
  );
}
