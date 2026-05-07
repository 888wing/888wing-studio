# 888wing-studio

純血構成主義 portfolio · CHUI SIU FAI

> See `docs/plans/2026-05-07-portfolio-design.md` for design and `docs/plans/2026-05-07-portfolio.md` for implementation.

## Stack
Astro 4 · React 18 · GSAP · Lenis · Tailwind 3 · MDX · Cloudflare Pages

## Develop
```bash
npm install
npm run dev      # local at :4321
npm run build    # production build to ./dist
npm test         # vitest unit tests
npm run test:e2e # playwright e2e
```

## Structure (in progress)
- `src/pages/` — routes (homepage, /lab, /work/*, /archive)
- `src/components/` — UI primitives + the 10 animation tricks
- `src/layouts/` — Astro layouts (Base, CaseStudy)
- `src/styles/` — design tokens + global styles
- `docs/plans/` — design docs + implementation plan

## Design tokens (Iron Law)
- Colors: `#8B1A1A` ink-red · `#0A0A0A` ink-black · `#F4EFE6` paper · `#E8C547` ink-yellow (only)
- No gradients · no rounded corners · no fade transitions
