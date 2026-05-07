import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function PressAssembly({
  children,
  direction = 'left',
}: {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}) {
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrap.current) return;
    const cover = wrap.current.querySelector('[data-cover]');
    const content = wrap.current.querySelector('[data-content]');
    if (!cover || !content) return;

    if (prefersReducedMotion()) {
      gsap.set(cover, { x: '-100%' });
      gsap.set(content, { opacity: 1 });
      return;
    }

    const map = {
      left: { x: '-100%' },
      right: { x: '100%' },
      top: { y: '-100%' },
      bottom: { y: '100%' },
    };
    gsap.set(content, { opacity: 0 });
    const tl = gsap
      .timeline()
      .set(cover, { x: 0, y: 0 })
      .to(cover, { ...map[direction], duration: 0.6, ease: 'power4.inOut' })
      .to(content, { opacity: 1, duration: 0.01 }, '-=0.3');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={wrap} className="relative overflow-hidden">
      <div data-content>{children}</div>
      <div data-cover className="absolute inset-0 bg-ink-black z-10"></div>
    </div>
  );
}
