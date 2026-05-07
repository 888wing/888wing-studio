import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function MovableType({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll('[data-char]');
    if (prefersReducedMotion()) {
      gsap.set(chars, { y: 0, rotation: 0, opacity: 1 });
      return;
    }
    const tween = gsap.fromTo(
      chars,
      { y: -200, rotation: () => gsap.utils.random(-25, 25), opacity: 0 },
      {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power4.out',
        stagger: { each: 0.04, from: 'random' },
      }
    );
    return () => {
      tween.kill();
    };
  }, [text]);
  return (
    <h1 ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split('').map((c, i) => (
          <span
            key={i}
            data-char
            className="inline-block"
            style={{ whiteSpace: c === ' ' ? 'pre' : undefined }}
          >
            {c}
          </span>
        ))}
      </span>
    </h1>
  );
}
