import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

type Phrase = {
  html?: string;
  text?: string;
  size: string;
  rotate: number;
  align: 'left' | 'center' | 'right';
  color?: string;
};

const ALIGN_CLASS = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;

export default function KineticManifesto({ phrases }: { phrases: Phrase[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const items = ref.current.querySelectorAll('[data-phrase]');
    const tween = gsap.fromTo(
      items,
      {
        opacity: 0,
        y: 80,
        rotateZ: (i, el) => +(el as HTMLElement).dataset.rotate! - 30,
      },
      {
        opacity: 1,
        y: 0,
        rotateZ: (i, el) => +(el as HTMLElement).dataset.rotate!,
        ease: 'power3.out',
        duration: 0.7,
        stagger: 0.18,
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);
  return (
    <div ref={ref} className="space-y-2 py-32">
      {phrases.map((p, i) => {
        const common = {
          'data-phrase': '',
          'data-rotate': p.rotate,
          className: `font-display ${p.size} ${ALIGN_CLASS[p.align]}`,
          style: {
            color: p.color ?? 'inherit',
            transform: `rotate(${p.rotate}deg)`,
            transformOrigin: 'left center' as const,
          },
        };
        return p.html ? (
          <p key={i} {...common} dangerouslySetInnerHTML={{ __html: p.html }} />
        ) : (
          <p key={i} {...common}>{p.text}</p>
        );
      })}
    </div>
  );
}
