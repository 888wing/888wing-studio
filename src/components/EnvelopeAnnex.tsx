import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { shouldStartOpen } from '../lib/envelope';
import { prefersReducedMotion } from '../lib/motion';

export default function EnvelopeAnnex({
  id, num, title, summary, children,
}: {
  id: string;
  num: string;
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const start = shouldStartOpen(id, window.location.search, window.location.hash);
    if (start) {
      setOpen(true);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [id]);

  useEffect(() => {
    if (!bodyRef.current) return;
    if (tweenRef.current) tweenRef.current.kill();
    const reduced = prefersReducedMotion();
    if (open) {
      tweenRef.current = gsap.fromTo(
        bodyRef.current,
        { clipPath: 'inset(50% 0 50% 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0% 0)', opacity: 1, duration: reduced ? 0.01 : 0.6, ease: 'power3.out' }
      );
    } else {
      tweenRef.current = gsap.to(
        bodyRef.current,
        { clipPath: 'inset(50% 0 50% 0)', opacity: 0, duration: reduced ? 0.01 : 0.3, ease: 'power3.in' }
      );
    }
    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [open]);

  return (
    <section id={id} className="my-12 border-y-4 border-ink-black bg-paper">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-body`}
        className="w-full flex items-start gap-4 p-6 text-left hover:bg-ink-yellow/10 transition-colors"
      >
        <span className="font-mono text-ink-red text-xl">⊕</span>
        <div className="flex-1">
          <div className="font-mono text-xs text-ink-red mb-1">§ {num} · ANNEX</div>
          <h3 className="font-display text-3xl mb-2">{title}</h3>
          <p className="font-mono text-sm text-ink-black/80">{summary}</p>
        </div>
        <span className={`font-mono text-3xl text-ink-red transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          {open ? '×' : '+'}
        </span>
      </button>
      <div
        id={`${id}-body`}
        ref={bodyRef}
        style={{
          clipPath: 'inset(50% 0 50% 0)',
          opacity: 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        className={`p-8 ${open ? 'border-t-2 border-ink-black' : ''}`}
      >
        {children}
      </div>
    </section>
  );
}
