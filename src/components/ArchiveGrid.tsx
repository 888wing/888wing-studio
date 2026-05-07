import { useState, useRef } from 'react';
import { archiveItems, type ArchiveItem } from '../data/archive';
import { filterArchive } from '../lib/archive';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/motion';

const TAGS: (ArchiveItem['tag'] | null)[] = [null, 'GAME', 'TOOL', 'AI', 'WEB'];

export default function ArchiveGrid() {
  const [tag, setTag] = useState<ArchiveItem['tag'] | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const items = filterArchive(archiveItems, tag);

  function handleHover(idx: number) {
    if (!gridRef.current || prefersReducedMotion()) return;
    const cards = gridRef.current.querySelectorAll('[data-card]');
    cards.forEach((c, i) => {
      const dist = i - idx;
      gsap.to(c, { rotation: dist * 0.4, x: dist * 2, duration: 0.4 });
    });
  }
  function handleLeave() {
    if (!gridRef.current) return;
    gsap.to(gridRef.current.querySelectorAll('[data-card]'), { rotation: 0, x: 0, duration: 0.5 });
  }

  return (
    <>
      <div className="flex gap-2 mb-8 font-mono text-xs">
        {TAGS.map((t) => (
          <button
            key={t ?? 'all'}
            onClick={() => setTag(t)}
            className={`px-3 py-1 border-2 border-ink-black ${tag === t ? 'bg-ink-red text-paper' : 'bg-paper'}`}
          >{t ?? 'ALL'}</button>
        ))}
        <span className="ml-auto text-ink-black/60">{items.length} ITEMS</span>
      </div>
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4" onMouseLeave={handleLeave}>
        {items.map((it, i) => (
          <a
            key={it.slug}
            data-card
            href={it.href}
            onMouseEnter={() => handleHover(i)}
            className="block border-2 border-ink-black bg-paper p-3"
          >
            <img src={it.thumb} alt={it.name} className="w-full aspect-square object-cover mb-3" style={{ filter: 'grayscale(1) contrast(1.2)' }} />
            <div className="font-display text-lg leading-tight">{it.name}</div>
            <div className="font-mono text-[10px] text-ink-red mt-1">{it.tag} · {it.year}</div>
            <div className="font-mono text-xs mt-1 text-ink-black/70">{it.tagline}</div>
          </a>
        ))}
      </div>
    </>
  );
}
