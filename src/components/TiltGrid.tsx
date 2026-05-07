import { useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/motion';

// Note: onMouseEnter/onMouseLeave don't fire on touch devices — grid still
// renders fine, just no tilt effect. Acceptable graceful degradation.
export default function TiltGrid({ items }: { items: { title: string; tag: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);

  function handleHover(idx: number) {
    if (!ref.current || prefersReducedMotion()) return;
    const cards = ref.current.querySelectorAll('[data-card]');
    cards.forEach((card, i) => {
      const dist = i - idx;
      gsap.to(card, {
        rotation: dist * 0.6,
        x: dist * 4,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  }
  function handleLeave() {
    if (!ref.current) return;
    gsap.to(ref.current.querySelectorAll('[data-card]'), { rotation: 0, x: 0, duration: 0.6, ease: 'power3.out' });
  }

  return (
    <div ref={ref} className="grid grid-cols-4 gap-4" onMouseLeave={handleLeave}>
      {items.map((it, i) => (
        <div
          key={i}
          data-card
          onMouseEnter={() => handleHover(i)}
          className="border-2 border-ink-black bg-paper p-4 cursor-pointer"
        >
          <div className="font-display text-2xl">{it.title}</div>
          <div className="font-mono text-xs text-ink-red mt-2">{it.tag}</div>
        </div>
      ))}
    </div>
  );
}
