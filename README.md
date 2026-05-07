# 888wing-studio

純血構成主義 portfolio · CHUI SIU FAI

Hong Kong, 2026.

---

## Live

- **Production:** https://888wing-studio.pages.dev (placeholder until custom domain)
- **Repo:** https://github.com/888wing/888wing-studio

## Stack

- **Framework:** Astro 4 + React 18 islands
- **Animation:** GSAP 3 + ScrollTrigger + Lenis (smooth scroll)
- **Styling:** Tailwind CSS 3 with strict design tokens
- **Content:** MDX (case studies)
- **Hosting:** Cloudflare Pages (auto-deploy on push)

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site → ./dist
npm test         # vitest unit tests
npm run test:e2e # playwright e2e
```

## Structure

```
src/
├── components/        # UI primitives + the 10 animation tricks
│   ├── HomeHero / HomeManifesto / HomeHeroes / HomeArchive / HomeColophon
│   ├── PressAssembly / RedWedge / MovableType / HalftoneImage
│   ├── KineticManifesto / TiltGrid / RegistrationCursor
│   ├── InkButton / InkStrip / GridOverlay
│   ├── EnvelopeAnnex / ExpandToggle (case study collapsible)
│   ├── TopStrip / SEO / MotionProvider
│   └── ...
├── layouts/
│   ├── Base.astro          # global shell
│   └── CaseStudy.astro     # work/* MDX layout
├── pages/
│   ├── index.astro         # homepage (5 sections)
│   ├── archive.astro       # 23-item filterable grid
│   ├── 404.astro           # MISPRINT
│   ├── lab/                # 10 animation primitives showcase
│   └── work/               # 4 hero case studies (MDX)
├── lib/                    # pure helpers (motion, archive, envelope)
├── data/                   # archive items
└── styles/                 # tokens, global, view-transitions, print
docs/plans/                 # design + implementation plan
tests/
├── unit/                   # vitest (10 tests)
└── e2e/                    # playwright (39 tests)
```

## Design tokens (Iron Law)

| Token | Hex |
|---|---|
| `ink-red` (paper bg) | `#8B1A1A` |
| `ink-red-bright` (dark bg, WCAG AA) | `#E85D5D` |
| `ink-black` | `#0A0A0A` |
| `paper` (cream) | `#F4EFE6` |
| `ink-yellow` (sparing) | `#E8C547` |

**Rules:** No gradients. No rounded corners (registration cursor exempt). No fade transitions. No raw hex outside tokens (SVG fills excepted with comment).

## The 10 animation tricks

| # | Trick | Where it lives |
|---|---|---|
| 01 | Press Assembly | `PressAssembly.tsx` |
| 02 | Red Wedge (scroll progress) | `RedWedge.astro` (global) |
| 03 | Diagonal Slice (page transition) | `view-transitions.css` |
| 04 | Movable Type | `MovableType.tsx` |
| 05 | Halftone Reveal | `HalftoneImage.astro` |
| 06 | Registration Cursor | `RegistrationCursor.astro` (global) |
| 07 | PROUN Grid Tilt | `TiltGrid.tsx` |
| 08 | Kinetic Manifesto | `KineticManifesto.tsx` |
| 09 | Ink Bleed (CSS) | `InkButton.astro` |
| 10 | Ink Strip (CSS marquee) | `InkStrip.astro` |

Each trick has a standalone showcase at `/lab/<trick-slug>`.

## Case study system

Each `/work/<project>` page is an MDX file with:
- 7-section spine: TITLE / HERO MEDIA / CONTEXT / APPROACH / [annex] / EXECUTION / OUTCOME / COLOPHON
- A collapsible "envelope" annex per project (`<EnvelopeAnnex>`):
  - `?expand=04A` URL param opens specific annex on load
  - `?expand=all` opens everything
  - Page-wide COMPRESSED/EXPANDED toggle dispatches `toggle-all` events

## Accessibility

- `prefers-reduced-motion: reduce` honored across all 10 tricks
- WCAG AA contrast on all surfaces (verified by `tests/e2e/a11y.spec.ts` via @axe-core/playwright)
- Print stylesheet (`@media print`) force-expands annexes, hides decoration, shows link URLs
- Native cursor restored on touch + reduced-motion

## Deploy

Push to `feat/scaffold-portfolio` → Cloudflare Pages auto-builds preview.
Merge to `master` → Cloudflare Pages auto-deploys production.

## Docs

- [Design](docs/plans/2026-05-07-portfolio-design.md) — visual rules, animation vocabulary, hero structure
- [Implementation Plan](docs/plans/2026-05-07-portfolio.md) — 34-task breakdown

---

🤖 Built with [Claude Code](https://claude.com/claude-code).
