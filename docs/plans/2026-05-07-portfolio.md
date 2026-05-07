# Portfolio Implementation Plan — 純血構成主義

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 5-page portfolio site (1 home + 4 hero case studies + 1 archive) in pure 1920s Soviet Constructivist style with 10 custom animation tricks, deployed to Cloudflare Pages.

**Architecture:** Astro 4 with React islands for interactive bits. GSAP + ScrollTrigger + Lenis for choreographed animation. Tailwind with strict 4-color design tokens. MDX for case study content. Build animations as isolated primitives in `/lab` first, then compose into pages.

**Tech Stack:** Astro 4, React 18, Tailwind CSS, GSAP 3, Lenis, Framer Motion, MDX, Vitest, Playwright, Cloudflare Pages

**Design doc:** `docs/plans/2026-05-07-portfolio-design.md`

---

## Phase 0 — Foundation (deploy on Day 1)

### Task 1: Scaffold Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/pages/index.astro`, `src/layouts/Base.astro`

**Step 1: Init Astro**

Run from `~/Projects/portfolio`:
```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --skip-houston --yes
```

Expected: Creates `package.json`, `src/`, `astro.config.mjs` without overwriting existing `docs/` or `.git/`.

**Step 2: Install dependencies**

```bash
npm install
npm install @astrojs/react @astrojs/mdx @astrojs/tailwind tailwindcss react react-dom @types/react @types/react-dom
npm install gsap @studio-freight/lenis framer-motion
npm install -D vitest @vitest/ui @playwright/test
```

**Step 3: Wire integrations in `astro.config.mjs`**

Replace contents:
```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), mdx(), tailwind({ applyBaseStyles: false })],
  experimental: { viewTransitions: true },
  vite: { ssr: { noExternal: ['gsap'] } },
});
```

**Step 4: Verify dev server boots**

Run: `npm run dev`
Expected: Server starts on `http://localhost:4321`, default Astro page renders.
Kill with Ctrl+C.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 4 + React + MDX + Tailwind + GSAP"
```

---

### Task 2: Define design tokens

**Files:**
- Create: `tailwind.config.mjs`, `src/styles/global.css`, `src/styles/tokens.css`

**Step 1: Write `tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        'ink-red': '#8B1A1A',
        'ink-black': '#0A0A0A',
        'ink-yellow': '#E8C547',
        paper: '#F4EFE6',
      },
      fontFamily: {
        display: ['"Tusker Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        'tc-serif': ['"Noto Serif TC"', 'serif'],
        'tc-sans': ['"Noto Sans TC"', 'sans-serif'],
      },
      borderRadius: { none: '0' },
      transitionTimingFunction: {
        press: 'cubic-bezier(0.7, 0, 0.3, 1)',
      },
    },
  },
  corePlugins: {
    borderRadius: false, // no rounded corners except registration cursor
  },
};
```

**Step 2: Write `src/styles/tokens.css`**

```css
@layer base {
  :root {
    --grid-gutter: 24px;
    --grid-cols: 12;
    --paper-noise-opacity: 0.04;
  }
  @media (max-width: 768px) {
    :root { --grid-cols: 4; }
  }
  html { background: theme('colors.paper'); color: theme('colors.ink-black'); }
  body { font-family: theme('fontFamily.mono'); }
  *, *::before, *::after { border-radius: 0 !important; }
}
```

**Step 3: Write `src/styles/global.css`**

```css
@import 'tailwindcss/base';
@import './tokens.css';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

**Step 4: Import global styles in `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
const { title = 'CHUI SIU FAI' } = Astro.props;
---
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=JetBrains+Mono:wght@400;700&family=Noto+Sans+TC:wght@900&family=Noto+Serif+TC:wght@900&display=swap" rel="stylesheet" />
  </head>
  <body><slot /></body>
</html>
```

**Step 5: Smoke-test in browser**

Replace `src/pages/index.astro` with:
```astro
---
import Base from '../layouts/Base.astro';
---
<Base>
  <h1 class="font-display text-9xl text-ink-red p-8">CONSTRUCTIVIST</h1>
  <p class="font-mono text-ink-black p-8">tokens loaded</p>
</Base>
```

Run `npm run dev`, open `http://localhost:4321`.
Expected: Massive red headline on cream paper background, mono subtitle, no rounded corners anywhere.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: define 4-color design tokens + font stack"
```

---

### Task 3: Grid overlay debug component

**Files:**
- Create: `src/components/GridOverlay.astro`
- Modify: `src/layouts/Base.astro`

**Step 1: Write component**

```astro
---
// src/components/GridOverlay.astro
---
<div class="grid-overlay pointer-events-none fixed inset-0 z-50 hidden" data-grid>
  <div class="mx-auto h-full max-w-[1440px] px-6 grid grid-cols-12 gap-6">
    {Array.from({ length: 12 }).map((_, i) => (
      <div class="h-full border-l border-r border-ink-red/20 relative">
        <span class="absolute top-2 left-1 font-mono text-[10px] text-ink-red/60">
          {String(i + 1).padStart(2, '0')}
        </span>
      </div>
    ))}
  </div>
</div>
<script>
  document.addEventListener('keydown', (e) => {
    if (e.key === 'g' && (e.metaKey || e.ctrlKey)) {
      document.querySelector('[data-grid]')?.classList.toggle('hidden');
    }
  });
</script>
```

**Step 2: Mount in `Base.astro`**

Add inside `<body>` before `<slot />`:
```astro
<GridOverlay />
```

Add to imports:
```astro
import GridOverlay from '../components/GridOverlay.astro';
```

**Step 3: Visually verify**

Reload `http://localhost:4321`. Press ⌘G (or Ctrl+G). Expected: 12 vertical hairlines with `01`–`12` numbers appear as overlay. Press again to hide.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add grid overlay debug toggle (cmd+g)"
```

---

### Task 4: Cloudflare Pages deploy + GitHub remote

**Files:**
- Create: `wrangler.toml`
- Modify: `package.json` (add deploy script)

**Step 1: Create GitHub repo**

Run:
```bash
gh repo create portfolio --public --source=. --remote=origin --push
```
Expected: New repo on GitHub, current branch pushed.

**Step 2: Hook up Cloudflare Pages**

User action — open Cloudflare dashboard → Pages → Create project → Connect to GitHub → select `portfolio` → Build command `npm run build` → Build output `dist` → Deploy.

(If user wants CLI instead, install `wrangler` and `npx wrangler pages deploy dist` after build.)

**Step 3: Verify production URL**

Wait for first build (~2 min). Visit `<auto-generated>.pages.dev`. Expected: same red CONSTRUCTIVIST headline visible.

**Step 4: Add deploy badge to README**

Create `README.md`:
```md
# portfolio

純血構成主義 portfolio site. See `docs/plans/2026-05-07-portfolio-design.md`.

- Local: `npm run dev`
- Build: `npm run build`
- Deploy: auto on push to `main`
```

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: add README + deploy live to cloudflare pages"
git push
```

---

### Task 5: Set up testing harness

**Files:**
- Create: `vitest.config.ts`, `playwright.config.ts`, `tests/unit/.gitkeep`, `tests/e2e/.gitkeep`

**Step 1: Vitest config**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { environment: 'jsdom', include: ['tests/unit/**/*.test.ts'] },
});
```

**Step 2: Playwright config**

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  webServer: { command: 'npm run dev', url: 'http://localhost:4321', reuseExistingServer: true },
  use: { baseURL: 'http://localhost:4321' },
});
```

**Step 3: Add scripts to `package.json`**

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

**Step 4: Install Playwright browsers**

```bash
npx playwright install chromium
```

**Step 5: Sanity test**

Create `tests/unit/sanity.test.ts`:
```ts
import { test, expect } from 'vitest';
test('sanity', () => expect(1 + 1).toBe(2));
```

Run: `npm test`
Expected: 1 passed.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: set up vitest + playwright harness"
```

---

## Phase 1 — Animation primitives (build in `/lab` first)

Build all 10 animation tricks as isolated showcase components in `/lab/<trick-name>` route. This lets us polish each animation without page-layout noise. Compose into real pages in Phase 2.

### Task 6: Lab index route + reduced-motion utility

**Files:**
- Create: `src/pages/lab/index.astro`, `src/lib/motion.ts`
- Test: `tests/unit/motion.test.ts`

**Step 1: Write reduced-motion test**

```ts
// tests/unit/motion.test.ts
import { test, expect, vi } from 'vitest';
import { prefersReducedMotion } from '../../src/lib/motion';

test('returns true when matchMedia matches reduce', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  expect(prefersReducedMotion()).toBe(true);
});
test('returns false when matchMedia does not match', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  expect(prefersReducedMotion()).toBe(false);
});
test('returns false in non-browser env', () => {
  vi.stubGlobal('matchMedia', undefined);
  expect(prefersReducedMotion()).toBe(false);
});
```

**Step 2: Run test, verify it fails**

Run: `npm test`
Expected: 3 fails — `prefersReducedMotion` not defined.

**Step 3: Implement**

```ts
// src/lib/motion.ts
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

**Step 4: Run test, verify pass**

Run: `npm test`
Expected: 3 passed.

**Step 5: Lab index**

```astro
---
// src/pages/lab/index.astro
import Base from '../../layouts/Base.astro';
const tricks = [
  ['01', 'Press Assembly', '/lab/press-assembly'],
  ['02', 'Red Wedge', '/lab/red-wedge'],
  ['03', 'Diagonal Slice', '/lab/diagonal-slice'],
  ['04', 'Movable Type', '/lab/movable-type'],
  ['05', 'Halftone Reveal', '/lab/halftone-reveal'],
  ['06', 'Registration Cursor', '/lab/cursor'],
  ['07', 'Grid Tilt', '/lab/grid-tilt'],
  ['08', 'Kinetic Type', '/lab/kinetic-type'],
  ['09', 'Ink Bleed', '/lab/ink-bleed'],
  ['10', 'Ink Strip', '/lab/ink-strip'],
];
---
<Base title="LAB / 10 TRICKS">
  <main class="p-12">
    <h1 class="font-display text-7xl mb-12">LAB · 10 TRICKS</h1>
    <ul class="space-y-2 font-mono text-xl">
      {tricks.map(([num, name, href]) => (
        <li>
          <a href={href} class="text-ink-black hover:text-ink-red transition-colors">
            <span class="text-ink-red">{num}</span> · {name}
          </a>
        </li>
      ))}
    </ul>
  </main>
</Base>
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: lab index + reduced-motion utility"
```

---

### Task 7: Trick 06 — Registration Cursor (build first, used by all other tricks)

**Files:**
- Create: `src/components/RegistrationCursor.astro`, `src/pages/lab/cursor.astro`
- Modify: `src/layouts/Base.astro`

**Step 1: Component**

```astro
---
// src/components/RegistrationCursor.astro
---
<div id="reg-cursor" class="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference" style="will-change:transform;transform:translate(-100px,-100px)">
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" stroke="white" stroke-width="1.5" />
    <line x1="16" y1="2" x2="16" y2="30" stroke="white" stroke-width="1.5" />
    <line x1="2" y1="16" x2="30" y2="16" stroke="white" stroke-width="1.5" />
  </svg>
</div>
<script>
  const cursor = document.getElementById('reg-cursor')!;
  let x = 0, y = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', (e) => { tx = e.clientX - 16; ty = e.clientY - 16; });
  function loop() {
    x += (tx - x) * 0.25;
    y += (ty - y) * 0.25;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(loop);
  }
  loop();
  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.style.transform += ' scale(1.8)');
    el.addEventListener('mouseleave', () => { cursor.style.transform = cursor.style.transform.replace(' scale(1.8)', ''); });
  });
  document.body.style.cursor = 'none';
</script>
```

**Step 2: Mount in `Base.astro`**

```astro
import RegistrationCursor from '../components/RegistrationCursor.astro';
// inside body:
<RegistrationCursor />
```

**Step 3: Lab page**

```astro
---
// src/pages/lab/cursor.astro
import Base from '../../layouts/Base.astro';
---
<Base title="LAB / 06 cursor">
  <main class="p-12 min-h-screen">
    <h1 class="font-display text-5xl mb-8">06 · REGISTRATION CURSOR</h1>
    <p class="font-mono mb-4">Move mouse around. Hover the link below.</p>
    <a href="/lab" class="text-ink-red text-2xl">← back to lab</a>
  </main>
</Base>
```

**Step 4: Manually verify**

`npm run dev`, visit `/lab/cursor`. Expected: native cursor hidden; ⊕ crosshair follows mouse with slight ease; hovering the link makes crosshair grow ~1.8x; `mix-blend-difference` makes it readable on both light and dark backgrounds.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: trick 06 registration cursor"
```

---

### Task 8: GSAP + Lenis provider

**Files:**
- Create: `src/components/MotionProvider.astro`
- Modify: `src/layouts/Base.astro`

**Step 1: Provider**

```astro
---
// src/components/MotionProvider.astro
---
<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Lenis from '@studio-freight/lenis';
  import { prefersReducedMotion } from '../lib/motion';

  gsap.registerPlugin(ScrollTrigger);

  if (!prefersReducedMotion()) {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Expose for debug
  (window as any).gsap = gsap;
  (window as any).ScrollTrigger = ScrollTrigger;
</script>
```

**Step 2: Mount in `Base.astro`** (inside body)

```astro
<MotionProvider />
```

**Step 3: Manually verify**

Reload any lab page. Open devtools console. Run `gsap.version`. Expected: prints version string. Scroll feels smoother (Lenis ease).

Toggle OS reduced motion preference, reload. Expected: scroll reverts to native (Lenis disabled).

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: GSAP + Lenis provider with reduced-motion guard"
```

---

### Task 9: Trick 04 — Movable Type (heading)

**Files:**
- Create: `src/components/MovableType.tsx`, `src/pages/lab/movable-type.astro`

**Step 1: Component**

```tsx
// src/components/MovableType.tsx
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
    gsap.fromTo(
      chars,
      { y: -200, rotation: () => gsap.utils.random(-25, 25), opacity: 0 },
      {
        y: 0, rotation: 0, opacity: 1,
        duration: 0.8, ease: 'power4.out',
        stagger: { each: 0.04, from: 'random' },
      }
    );
  }, [text]);
  return (
    <h1 ref={ref} className={className}>
      {text.split('').map((c, i) => (
        <span key={i} data-char className="inline-block" style={{ whiteSpace: c === ' ' ? 'pre' : undefined }}>
          {c}
        </span>
      ))}
    </h1>
  );
}
```

**Step 2: Lab page**

```astro
---
// src/pages/lab/movable-type.astro
import Base from '../../layouts/Base.astro';
import MovableType from '../../components/MovableType.tsx';
---
<Base title="LAB / 04 movable type">
  <main class="p-12 min-h-screen">
    <p class="font-mono mb-4">Reload to replay.</p>
    <MovableType client:load text="LOOPLINE" className="font-display text-[12rem] leading-none text-ink-red" />
    <a href="/lab" class="font-mono text-ink-red mt-12 inline-block">← back</a>
  </main>
</Base>
```

**Step 3: Manually verify**

Visit `/lab/movable-type`. Expected: each letter falls from above with random rotation, snaps into final position with crisp ease, staggered randomly. Reload toggles OS reduced motion → letters appear instantly with no animation.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: trick 04 movable type heading"
```

---

### Task 10: Trick 05 — Halftone Reveal (image)

**Files:**
- Create: `src/components/HalftoneImage.astro`, `src/pages/lab/halftone-reveal.astro`, `public/lab/sample.jpg` (use placeholder)

**Step 1: Add a placeholder image**

```bash
mkdir -p public/lab
curl -s 'https://picsum.photos/seed/portfolio/1600/1000' -o public/lab/sample.jpg
```

**Step 2: Component**

```astro
---
// src/components/HalftoneImage.astro
const { src, alt, dotSize = 6 } = Astro.props;
const id = 'h' + Math.random().toString(36).slice(2, 8);
---
<div class="halftone-wrap relative overflow-hidden" data-halftone={id}>
  <img src={src} alt={alt} class="block w-full h-auto" style={`filter: contrast(1.2) grayscale(1); --dot:${dotSize}px;`} />
  <div class="halftone-mask absolute inset-0 bg-paper" style={`mask-image: radial-gradient(circle, transparent 1px, black 2px); mask-size: var(--dot) var(--dot); -webkit-mask-image: radial-gradient(circle, transparent 1px, black 2px); -webkit-mask-size: var(--dot) var(--dot);`}></div>
</div>
<script define:vars={{ id }}>
  import('gsap').then(({ gsap }) => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      const wrap = document.querySelector(`[data-halftone="${id}"]`);
      const mask = wrap.querySelector('.halftone-mask');
      const img = wrap.querySelector('img');
      gsap.fromTo(wrap, { '--dot': '40px' }, {
        '--dot': '0px',
        ease: 'power3.out', duration: 1.4,
        scrollTrigger: { trigger: wrap, start: 'top 80%', once: true },
        onUpdate() {
          const v = wrap.style.getPropertyValue('--dot');
          mask.style.maskSize = `${v} ${v}`;
          mask.style.webkitMaskSize = `${v} ${v}`;
          if (parseFloat(v) <= 1) { mask.style.opacity = '0'; img.style.filter = 'none'; }
        }
      });
    });
  });
</script>
```

**Step 3: Lab page**

```astro
---
import Base from '../../layouts/Base.astro';
import HalftoneImage from '../../components/HalftoneImage.astro';
---
<Base title="LAB / 05 halftone reveal">
  <main class="p-12">
    <h1 class="font-display text-5xl mb-8">05 · HALFTONE REVEAL</h1>
    <div class="h-[80vh]"></div>
    <HalftoneImage src="/lab/sample.jpg" alt="sample" />
    <a href="/lab" class="font-mono text-ink-red mt-12 inline-block">← back</a>
  </main>
</Base>
```

**Step 4: Manually verify**

Visit `/lab/halftone-reveal`. Scroll down. Expected: image starts as coarse halftone dots, dots shrink to invisible as it enters viewport, final image is grayscale-then-color sharp.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: trick 05 halftone reveal image"
```

---

### Task 11: Trick 02 — Red Wedge (scroll progress)

**Files:**
- Create: `src/components/RedWedge.astro`, `src/pages/lab/red-wedge.astro`

**Step 1: Component**

```astro
---
// src/components/RedWedge.astro — fixed bottom-right scroll progress
---
<div id="red-wedge" class="pointer-events-none fixed bottom-8 right-8 z-40 origin-bottom-right" style="width:80px;height:80px;transform:scale(0) rotate(0deg)">
  <svg viewBox="0 0 100 100" class="w-full h-full"><polygon points="0,100 100,100 100,0" fill="#8B1A1A" /></svg>
</div>
<script>
  import('gsap').then(({ gsap }) => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      const wedge = document.getElementById('red-wedge')!;
      ScrollTrigger.create({
        start: 'top top', end: 'bottom bottom',
        onUpdate(self) {
          const p = self.progress;
          gsap.to(wedge, { scale: p * 1.5, rotation: p * 90, duration: 0.3, ease: 'power2.out' });
        },
      });
    });
  });
</script>
```

**Step 2: Mount in `Base.astro`**

```astro
import RedWedge from '../components/RedWedge.astro';
// in body:
<RedWedge />
```

**Step 3: Lab page**

```astro
---
import Base from '../../layouts/Base.astro';
---
<Base title="LAB / 02 red wedge">
  <main class="p-12">
    <h1 class="font-display text-5xl mb-8">02 · RED WEDGE</h1>
    <p class="font-mono">Scroll down. Watch bottom-right corner.</p>
    <div class="h-[300vh]"></div>
    <a href="/lab" class="font-mono text-ink-red">← back</a>
  </main>
</Base>
```

**Step 4: Manually verify**

Visit `/lab/red-wedge`. Scroll. Expected: red triangle bottom-right grows from 0 to ~1.5x and rotates 0→90° as scroll progresses through the page.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: trick 02 red wedge scroll progress"
```

---

### Task 12: Trick 01 — Press Assembly (block reveal)

**Files:**
- Create: `src/components/PressAssembly.tsx`, `src/pages/lab/press-assembly.astro`

**Step 1: Component**

```tsx
// src/components/PressAssembly.tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function PressAssembly({ children, direction = 'left' }: { children: React.ReactNode; direction?: 'left' | 'right' | 'top' | 'bottom' }) {
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrap.current || prefersReducedMotion()) return;
    const cover = wrap.current.querySelector('[data-cover]');
    const content = wrap.current.querySelector('[data-content]');
    const map = { left: { x: '-100%' }, right: { x: '100%' }, top: { y: '-100%' }, bottom: { y: '100%' } };
    gsap.set(content, { opacity: 0 });
    gsap.timeline()
      .set(cover, { x: 0, y: 0 })
      .to(cover, { ...map[direction], duration: 0.6, ease: 'power4.inOut' })
      .to(content, { opacity: 1, duration: 0.01 }, '-=0.3');
  }, []);
  return (
    <div ref={wrap} className="relative overflow-hidden">
      <div data-content>{children}</div>
      <div data-cover className="absolute inset-0 bg-ink-black z-10"></div>
    </div>
  );
}
```

**Step 2: Lab page**

```astro
---
import Base from '../../layouts/Base.astro';
import PressAssembly from '../../components/PressAssembly.tsx';
---
<Base title="LAB / 01 press assembly">
  <main class="p-12">
    <h1 class="font-display text-5xl mb-8">01 · PRESS ASSEMBLY</h1>
    <PressAssembly client:load direction="left">
      <div class="bg-paper p-8 border-4 border-ink-black">
        <h2 class="font-display text-7xl text-ink-red">DOVA</h2>
        <p class="font-mono">Travel SaaS · 2026</p>
      </div>
    </PressAssembly>
    <a href="/lab" class="font-mono text-ink-red mt-12 inline-block">← back</a>
  </main>
</Base>
```

**Step 3: Manually verify**

Visit `/lab/press-assembly`. Expected: black slab covers the card area on load, then slides off to the left, revealing card content. Reload replays.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: trick 01 press assembly cover slab"
```

---

### Task 13: Trick 08 — Kinetic Type (manifesto)

**Files:**
- Create: `src/components/KineticManifesto.tsx`, `src/pages/lab/kinetic-type.astro`

**Step 1: Component**

```tsx
// src/components/KineticManifesto.tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger);

type Phrase = { text: string; size: string; rotate: number; align: 'left' | 'center' | 'right'; color?: string };

export default function KineticManifesto({ phrases }: { phrases: Phrase[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const items = ref.current.querySelectorAll('[data-phrase]');
    gsap.fromTo(
      items,
      { opacity: 0, y: 80, rotateZ: (i, el) => +(el as HTMLElement).dataset.rotate! - 30 },
      {
        opacity: 1, y: 0,
        rotateZ: (i, el) => +(el as HTMLElement).dataset.rotate!,
        ease: 'power3.out', duration: 0.7, stagger: 0.18,
        scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
      }
    );
  }, []);
  return (
    <div ref={ref} className="space-y-2 py-32">
      {phrases.map((p, i) => (
        <div
          key={i}
          data-phrase
          data-rotate={p.rotate}
          className={`font-display ${p.size} text-${p.align}`}
          style={{ color: p.color ?? 'inherit', transform: `rotate(${p.rotate}deg)`, transformOrigin: 'left center' }}
        >
          {p.text}
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Lab page**

```astro
---
import Base from '../../layouts/Base.astro';
import KineticManifesto from '../../components/KineticManifesto.tsx';
const sample = [
  { text: '我做能 ship 的東西。', size: 'text-7xl', rotate: -2, align: 'left' },
  { text: '不做 demo。', size: 'text-9xl', rotate: 1, align: 'left', color: '#8B1A1A' },
  { text: '一個人, 全端, 跨平台。', size: 'text-5xl', rotate: -1, align: 'left' },
];
---
<Base title="LAB / 08 kinetic">
  <main class="p-12">
    <div class="h-[60vh]"></div>
    <KineticManifesto client:load phrases={sample} />
    <a href="/lab" class="font-mono text-ink-red">← back</a>
  </main>
</Base>
```

**Step 3: Manually verify**

Scroll into view. Expected: each phrase rises up + rotates into final tilted position with stagger; settles at varying angles like a ransom-note poster.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: trick 08 kinetic manifesto"
```

---

### Task 14: Trick 09 — Ink Bleed button

**Files:**
- Create: `src/components/InkButton.astro`, add lab demo to `/lab/ink-bleed.astro`

**Step 1: Component**

```astro
---
// src/components/InkButton.astro
const { href, children } = Astro.props;
const Tag = href ? 'a' : 'button';
---
<Tag href={href} class="ink-btn relative inline-block px-6 py-3 font-mono uppercase tracking-wide bg-ink-red text-paper border-2 border-ink-black overflow-visible">
  <slot />
</Tag>
<style>
  .ink-btn { transition: transform 200ms cubic-bezier(0.7,0,0.3,1); }
  .ink-btn::before {
    content: ''; position: absolute; inset: -2px;
    background: #8B1A1A; z-index: -1;
    transition: inset 200ms cubic-bezier(0.7,0,0.3,1), opacity 200ms;
    opacity: 0;
  }
  .ink-btn:hover::before { inset: -4px -6px; opacity: 1; }
  .ink-btn:hover { transform: translate(-1px, -1px); }
</style>
```

**Step 2: Lab page**

```astro
---
import Base from '../../layouts/Base.astro';
import InkButton from '../../components/InkButton.astro';
---
<Base title="LAB / 09 ink bleed">
  <main class="p-12 space-y-8">
    <h1 class="font-display text-5xl">09 · INK BLEED</h1>
    <InkButton>VIEW WORK</InkButton>
    <InkButton href="/lab">← back</InkButton>
  </main>
</Base>
```

**Step 3: Manually verify**

Hover button. Expected: red bleeds outward 2-4px asymmetrically (more on sides), simulating misregistered ink.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: trick 09 ink bleed button"
```

---

### Task 15: Trick 10 — Ink Strip (footer marquee)

**Files:**
- Create: `src/components/InkStrip.astro`, `src/pages/lab/ink-strip.astro`

**Step 1: Component**

```astro
---
// src/components/InkStrip.astro
const swatches = ['C','M','Y','K','R','B','Y'];
---
<div class="ink-strip overflow-hidden border-t-4 border-ink-black bg-paper py-1">
  <div class="ink-strip-track flex gap-1 whitespace-nowrap">
    {Array.from({ length: 12 }).flatMap(() => swatches).map((s) => (
      <span class={`ink-swatch font-mono font-bold inline-flex items-center justify-center px-4 py-2 ${
        s === 'C' ? 'bg-cyan-500' :
        s === 'M' ? 'bg-pink-500' :
        s === 'Y' || s === 'B' ? 'bg-ink-yellow' :
        s === 'K' ? 'bg-ink-black text-paper' :
        s === 'R' ? 'bg-ink-red text-paper' : 'bg-ink-black text-paper'
      }`}>{s}</span>
    ))}
  </div>
</div>
<style>
  .ink-strip-track { animation: marquee 40s linear infinite; }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @media (prefers-reduced-motion: reduce) { .ink-strip-track { animation: none; } }
</style>
```

**Step 2: Lab page**

```astro
---
import Base from '../../layouts/Base.astro';
import InkStrip from '../../components/InkStrip.astro';
---
<Base title="LAB / 10 ink strip">
  <main class="p-12">
    <h1 class="font-display text-5xl mb-8">10 · INK STRIP</h1>
  </main>
  <InkStrip />
</Base>
```

**Step 3: Manually verify**

Visit page. Expected: bottom strip of CMYK + R/Y/K swatches scrolling left infinitely.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: trick 10 ink strip footer marquee"
```

---

### Task 16: Trick 03 — Diagonal Slice page transition (View Transitions)

**Files:**
- Create: `src/styles/view-transitions.css`
- Modify: `src/layouts/Base.astro` (enable view transitions), `src/styles/global.css`

**Step 1: Enable view transitions in Base**

Add inside `<head>` of `Base.astro`:
```astro
<ViewTransitions />
```

Import:
```astro
import { ViewTransitions } from 'astro:transitions';
```

**Step 2: Create transition CSS**

```css
/* src/styles/view-transitions.css */
@keyframes slice-out {
  to { clip-path: polygon(0 0, 100% 0, 0 100%, 0 100%); }
}
@keyframes slice-in {
  from { clip-path: polygon(100% 0, 100% 0, 100% 100%, 0 100%); }
  to { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
}
::view-transition-old(root) { animation: slice-out 0.5s cubic-bezier(0.7,0,0.3,1) both; }
::view-transition-new(root) { animation: slice-in 0.5s cubic-bezier(0.7,0,0.3,1) both; }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
}
```

**Step 3: Import in `global.css`**

```css
@import './view-transitions.css';
```

**Step 4: Manually verify**

Visit `/lab`, click any trick link. Expected: outgoing page wipes diagonally to bottom-left, incoming page slides in from bottom-right, both clipped diagonally. Press back, opposite direction.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: trick 03 diagonal slice view transition"
```

---

### Task 17: Trick 07 — PROUN Grid Tilt

**Files:**
- Create: `src/components/TiltGrid.tsx`, `src/pages/lab/grid-tilt.astro`

**Step 1: Component**

```tsx
// src/components/TiltGrid.tsx
import { useRef } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../lib/motion';

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
```

**Step 2: Lab page**

```astro
---
import Base from '../../layouts/Base.astro';
import TiltGrid from '../../components/TiltGrid.tsx';
const items = Array.from({ length: 12 }).map((_, i) => ({
  title: `WORK ${String(i+1).padStart(2,'0')}`, tag: ['GAME','TOOL','AI','WEB'][i%4]
}));
---
<Base title="LAB / 07 grid tilt">
  <main class="p-12">
    <h1 class="font-display text-5xl mb-8">07 · PROUN GRID TILT</h1>
    <TiltGrid client:load items={items} />
    <a href="/lab" class="font-mono text-ink-red mt-12 inline-block">← back</a>
  </main>
</Base>
```

**Step 3: Manually verify**

Hover any card. Expected: hovered card stays straight; neighbors fan out with slight rotation + horizontal offset like a deck of cards. Mouse leave returns to grid.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: trick 07 PROUN grid tilt"
```

---

## Phase 2 — Homepage composition

### Task 18: Top Strip (live clock + marquee)

**Files:**
- Create: `src/components/TopStrip.tsx`
- Modify: `src/layouts/Base.astro`

**Step 1: Component**

```tsx
// src/components/TopStrip.tsx
import { useEffect, useState } from 'react';
export default function TopStrip() {
  const [time, setTime] = useState('--:--:--');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hkt = new Date(d.getTime() + (d.getTimezoneOffset() + 480) * 60000);
      setTime(`${String(hkt.getHours()).padStart(2,'0')}:${String(hkt.getMinutes()).padStart(2,'0')}:${String(hkt.getSeconds()).padStart(2,'0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="bg-ink-black text-paper font-mono text-xs flex items-center justify-between px-4 py-2 border-b-2 border-ink-red sticky top-0 z-30">
      <span><span className="text-ink-red">●REC</span> &nbsp; HKT {time}</span>
      <span>PORTFOLIO / 2026 / CHUI SIU FAI</span>
      <span>v0.1 · ⊕ ⊕ ⊕</span>
    </div>
  );
}
```

**Step 2: Mount in `Base.astro`**

```astro
import TopStrip from '../components/TopStrip.tsx';
// at top of body, before everything:
<TopStrip client:load />
```

**Step 3: Verify**

Reload any page. Expected: black bar at top with red `●REC`, live HKT clock, project label centred, version right.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: top strip with live HKT clock"
```

---

### Task 19: Hero block (diagonal name + wedge)

**Files:**
- Create: `src/components/HomeHero.astro`
- Modify: `src/pages/index.astro`

**Step 1: Hero component**

```astro
---
// src/components/HomeHero.astro
import MovableType from './MovableType.tsx';
---
<section class="relative min-h-[90vh] overflow-hidden bg-paper px-8 py-16">
  <!-- big red wedge bg -->
  <svg class="absolute -left-20 -top-20 w-[60vw] h-[60vw] opacity-90" viewBox="0 0 100 100">
    <polygon points="0,0 100,0 0,100" fill="#8B1A1A" />
  </svg>
  <div class="relative z-10 max-w-[1440px] mx-auto" style="transform: rotate(-7deg); transform-origin: left top;">
    <MovableType client:load text="CHUI SIU FAI" className="font-display text-[clamp(4rem,14vw,18rem)] leading-[0.85] text-ink-black" />
    <p class="font-mono text-2xl mt-6 text-paper bg-ink-black inline-block px-3 py-1">
      DESIGNER · ENGINEER · AUTEUR
    </p>
  </div>
  <div class="absolute bottom-8 right-8 font-mono text-xs text-ink-black">
    ↓ scroll · 6 sections
  </div>
</section>
```

**Step 2: Update `index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import HomeHero from '../components/HomeHero.astro';
---
<Base>
  <HomeHero />
</Base>
```

**Step 3: Verify**

Visit `/`. Expected: 90vh hero, top-left big red triangle, name rotated -7° in massive type with movable-type animation, mono subtitle in black bar.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: home hero with diagonal name + red wedge bg"
```

---

### Task 20: Manifesto section + Hero 4 layout + Archive teaser + Colophon

**Files:**
- Create: `src/components/HomeManifesto.astro`, `src/components/HomeHeroes.astro`, `src/components/HomeArchive.astro`, `src/components/HomeColophon.astro`
- Modify: `src/pages/index.astro`

**Step 1: Manifesto**

```astro
---
// src/components/HomeManifesto.astro
import KineticManifesto from './KineticManifesto.tsx';
const phrases = [
  { text: '我做能 ship 的東西。', size: 'text-6xl', rotate: -2, align: 'left' },
  { text: '不做 demo。', size: 'text-8xl', rotate: 1, align: 'left', color: '#8B1A1A' },
  { text: '一個人, 全端, 跨平台。', size: 'text-4xl', rotate: -1, align: 'left' },
  { text: 'GAMES / TOOLS / AI / SaaS', size: 'text-3xl', rotate: 2, align: 'left' },
];
---
<section class="bg-paper px-8 py-32 border-t-4 border-ink-black">
  <div class="max-w-[1200px] mx-auto">
    <span class="font-mono text-ink-red text-xs">§ MANIFESTO</span>
    <KineticManifesto client:load phrases={phrases} />
  </div>
</section>
```

**Step 2: Hero 4 layout**

```astro
---
// src/components/HomeHeroes.astro
import HalftoneImage from './HalftoneImage.astro';
const heroes = [
  { num: '01', name: 'DOVA TRAVEL', tag: 'TRAVEL SAAS · OPERATING SYSTEM', href: '/work/dova', img: '/lab/sample.jpg' },
  { num: '02', name: 'LOOPLINE', tag: 'iOS · PHASER · IAP', href: '/work/loopline', img: '/lab/sample.jpg' },
  { num: '03', name: 'PRODRIVER HUB', tag: 'FLUTTER · CROSS-PLATFORM', href: '/work/prodriver', img: '/lab/sample.jpg' },
  { num: '04', name: 'LATENT', tag: 'macOS · AI CULLING', href: '/work/latent', img: '/lab/sample.jpg' },
];
---
<section class="bg-paper px-8 border-t-4 border-ink-black">
  <div class="px-4 py-6 border-b-2 border-ink-black flex items-baseline justify-between">
    <span class="font-mono text-ink-red">§ HERO · 04</span>
    <span class="font-mono text-xs">SELECTED WORK 2024–2026</span>
  </div>
  {heroes.map((h, i) => (
    <a href={h.href} class={`group block border-b-2 border-ink-black py-12 grid grid-cols-12 gap-6 items-center ${i%2===0 ? '' : 'flex-row-reverse'}`}>
      <div class={`col-span-12 md:col-span-5 ${i%2===0 ? 'md:order-1' : 'md:order-2'}`}>
        <div class="font-mono text-ink-red text-2xl mb-2">{h.num}</div>
        <h2 class="font-display text-7xl text-ink-black group-hover:text-ink-red transition-colors leading-none">{h.name}</h2>
        <p class="font-mono text-sm mt-4">{h.tag}</p>
        <span class="font-mono text-ink-red mt-6 inline-block">→ READ CASE</span>
      </div>
      <div class={`col-span-12 md:col-span-7 ${i%2===0 ? 'md:order-2' : 'md:order-1'}`}>
        <HalftoneImage src={h.img} alt={h.name} dotSize={8} />
      </div>
    </a>
  ))}
</section>
```

**Step 3: Archive teaser**

```astro
---
// src/components/HomeArchive.astro
---
<section class="bg-ink-black text-paper px-8 py-24 border-t-4 border-ink-red">
  <div class="max-w-[1200px] mx-auto flex items-end justify-between">
    <div>
      <span class="font-mono text-ink-red text-xs">§ ARCHIVE</span>
      <h2 class="font-display text-7xl mt-2">23 MORE</h2>
      <p class="font-mono text-sm mt-4 max-w-md">Games, tools, experiments, dead-ends. Every shipped repo.</p>
    </div>
    <a href="/archive" class="font-mono text-ink-yellow text-xl">→ ENTER ARCHIVE</a>
  </div>
</section>
```

**Step 4: Colophon**

```astro
---
// src/components/HomeColophon.astro
import InkStrip from './InkStrip.astro';
---
<footer class="bg-paper border-t-4 border-ink-black px-8 py-16">
  <div class="max-w-[1440px] mx-auto grid grid-cols-12 gap-6 font-mono text-sm">
    <div class="col-span-12 md:col-span-4">
      <span class="text-ink-red">⊕ COLOPHON</span>
      <p class="mt-4">Set in Tusker Grotesk + JetBrains Mono.<br/>Printed on screen, Hong Kong, 2026.</p>
    </div>
    <div class="col-span-6 md:col-span-3">
      <span class="text-ink-red">CONTACT</span>
      <p class="mt-4"><a href="mailto:nano122090@gmail.com" class="underline">nano122090@gmail.com</a></p>
    </div>
    <div class="col-span-6 md:col-span-3">
      <span class="text-ink-red">CODE</span>
      <p class="mt-4"><a href="https://github.com/chuisiufai" class="underline">github.com/chuisiufai</a></p>
    </div>
    <div class="col-span-12 md:col-span-2 text-right">
      <span class="text-ink-red">⊕</span>
      <p class="mt-4 text-xs">v0.1<br/>2026.05</p>
    </div>
  </div>
  <InkStrip />
</footer>
```

**Step 5: Compose homepage**

```astro
---
// src/pages/index.astro
import Base from '../layouts/Base.astro';
import HomeHero from '../components/HomeHero.astro';
import HomeManifesto from '../components/HomeManifesto.astro';
import HomeHeroes from '../components/HomeHeroes.astro';
import HomeArchive from '../components/HomeArchive.astro';
import HomeColophon from '../components/HomeColophon.astro';
---
<Base>
  <HomeHero />
  <HomeManifesto />
  <HomeHeroes />
  <HomeArchive />
  <HomeColophon />
</Base>
```

**Step 6: Verify full homepage**

Visit `/`. Scroll through all sections. Expected: hero → manifesto kinetic type → 4 hero cards alternating L/R → black archive teaser → colophon footer with marquee. All animations fire on scroll.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: full homepage composition (hero/manifesto/heroes/archive/colophon)"
```

---

## Phase 3 — Case study system

### Task 21: Case study layout + first stub page

**Files:**
- Create: `src/layouts/CaseStudy.astro`, `src/pages/work/dova.mdx`, `src/content/config.ts`

**Step 1: Layout**

```astro
---
// src/layouts/CaseStudy.astro
import Base from './Base.astro';
import InkStrip from '../components/InkStrip.astro';
const { title, year, role, stack, status, prev, next } = Astro.props;
---
<Base title={title}>
  <article class="bg-paper">
    <header class="px-8 py-24 border-b-4 border-ink-black">
      <span class="font-mono text-ink-red text-xs">§ 01 · TITLE</span>
      <h1 class="font-display text-[clamp(4rem,12vw,16rem)] leading-[0.85] mt-4 -rotate-2">{title}</h1>
      <div class="font-mono text-sm mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div><span class="text-ink-red">YEAR</span> {year}</div>
        <div><span class="text-ink-red">ROLE</span> {role}</div>
        <div><span class="text-ink-red">STACK</span> {stack}</div>
        <div><span class="text-ink-red">STATUS</span> {status}</div>
      </div>
    </header>
    <div class="px-8 py-16 max-w-[1200px] mx-auto prose-case">
      <slot />
    </div>
    <footer class="px-8 py-12 border-t-4 border-ink-black flex justify-between font-mono">
      {prev ? <a href={prev.href} class="text-ink-red">← {prev.label}</a> : <span/>}
      {next ? <a href={next.href} class="text-ink-red text-right">{next.label} →</a> : <span/>}
    </footer>
    <InkStrip />
  </article>
</Base>

<style is:global>
  .prose-case h2 { @apply font-display text-5xl text-ink-red mt-16 mb-6; }
  .prose-case h3 { @apply font-display text-3xl mt-12 mb-4; }
  .prose-case p { @apply font-mono text-base leading-relaxed mb-4; }
  .prose-case a { @apply underline; }
  .prose-case ul { @apply list-disc pl-6 font-mono; }
  .prose-case .section-num { @apply font-mono text-ink-red text-xs block mb-2; }
</style>
```

**Step 2: First MDX stub**

```mdx
---
# src/pages/work/dova.mdx
layout: ../../layouts/CaseStudy.astro
title: DOVA TRAVEL
year: 2026
role: Solo · Founder/Designer/Engineer
stack: Next.js · Postgres · OpenAI · Cloudflare
status: LIVE
next: { href: '/work/loopline', label: 'LOOPLINE' }
---

import HalftoneImage from '../../components/HalftoneImage.astro';

<span class="section-num">§ 02 · HERO MEDIA</span>
<HalftoneImage src="/lab/sample.jpg" alt="Dova screenshot" />

## CONTEXT

[placeholder — 200 words on why Dova exists, what problem it solves, who it's for]

## APPROACH

- [decision 1]
- [decision 2]
- [decision 3]

## EXECUTION

[placeholder — 300 words on how it was built]

## OUTCOME

[placeholder — metrics, links, lessons]
```

**Step 3: Verify**

Visit `/work/dova`. Expected: massive rotated DOVA TRAVEL header, metadata grid, MDX content rendered with case-study prose styles, prev/next nav at bottom.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: case study layout + dova stub"
```

---

### Task 22: Collapsible "envelope" annex component

**Files:**
- Create: `src/components/EnvelopeAnnex.tsx`
- Test: `tests/unit/envelope.test.ts`, `tests/e2e/envelope.spec.ts`

**Step 1: Write Vitest unit test for URL param parsing**

```ts
// tests/unit/envelope.test.ts
import { test, expect } from 'vitest';
import { shouldStartOpen } from '../../src/lib/envelope';

test('opens when ?expand matches id', () => {
  expect(shouldStartOpen('04A', '?expand=04A')).toBe(true);
});
test('opens when hash matches id', () => {
  expect(shouldStartOpen('04A', '', '#04A')).toBe(true);
});
test('opens when expand=all', () => {
  expect(shouldStartOpen('04A', '?expand=all')).toBe(true);
});
test('closed otherwise', () => {
  expect(shouldStartOpen('04A', '', '')).toBe(false);
  expect(shouldStartOpen('04A', '?expand=05B', '#06C')).toBe(false);
});
```

**Step 2: Run, verify failure**

Run: `npm test`. Expected: 4 fails (module not found).

**Step 3: Implement helper**

```ts
// src/lib/envelope.ts
export function shouldStartOpen(id: string, search: string = '', hash: string = ''): boolean {
  const params = new URLSearchParams(search);
  const expand = params.get('expand');
  if (expand === 'all' || expand === id) return true;
  if (hash === `#${id}` || hash.replace(/^#/, '') === id) return true;
  return false;
}
```

**Step 4: Run, verify pass**

Run: `npm test`. Expected: all pass.

**Step 5: Implement React component**

```tsx
// src/components/EnvelopeAnnex.tsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { shouldStartOpen } from '../lib/envelope';
import { prefersReducedMotion } from '../lib/motion';

export default function EnvelopeAnnex({
  id, num, title, summary, children,
}: {
  id: string; num: string; title: string; summary: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = shouldStartOpen(id, window.location.search, window.location.hash);
    if (start) {
      setOpen(true);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [id]);

  useEffect(() => {
    if (!bodyRef.current) return;
    const reduced = prefersReducedMotion();
    if (open) {
      gsap.fromTo(bodyRef.current,
        { clipPath: 'inset(50% 0 50% 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0% 0)', opacity: 1, duration: reduced ? 0.01 : 0.6, ease: 'power3.out' });
    } else {
      gsap.to(bodyRef.current,
        { clipPath: 'inset(50% 0 50% 0)', opacity: 0, duration: reduced ? 0.01 : 0.3, ease: 'power3.in' });
    }
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
        style={{ clipPath: 'inset(50% 0 50% 0)', opacity: 0 }}
        className={open ? 'p-8 border-t-2 border-ink-black' : 'hidden'}
      >
        {open && children}
      </div>
    </section>
  );
}
```

**Step 6: Wire into Dova page**

Add to `src/pages/work/dova.mdx` between APPROACH and EXECUTION:

```mdx
import EnvelopeAnnex from '../../components/EnvelopeAnnex.tsx';

<EnvelopeAnnex client:load id="04A" num="04A" title="SYSTEM MAP" summary="Dova by content-engine / competitor-watch / cruise-intel — three subsystems forming an automated daily loop. Expand for full architecture diagram and data flow.">
  <p class="font-mono">[placeholder for system diagram]</p>
</EnvelopeAnnex>
```

**Step 7: E2E test**

```ts
// tests/e2e/envelope.spec.ts
import { test, expect } from '@playwright/test';

test('annex starts closed by default', async ({ page }) => {
  await page.goto('/work/dova');
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'false');
});
test('clicking opens the annex', async ({ page }) => {
  await page.goto('/work/dova');
  await page.getByRole('button', { name: /SYSTEM MAP/ }).click();
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'true');
});
test('?expand=04A opens it on load', async ({ page }) => {
  await page.goto('/work/dova?expand=04A');
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'true');
});
test('?expand=all opens it', async ({ page }) => {
  await page.goto('/work/dova?expand=all');
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'true');
});
```

**Step 8: Run e2e**

```bash
npm run test:e2e
```
Expected: 4 passed.

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: envelope annex collapsible with URL param + e2e"
```

---

### Task 23: COMPRESSED/EXPANDED page-wide toggle

**Files:**
- Create: `src/components/ExpandToggle.tsx`
- Modify: `src/layouts/CaseStudy.astro`

**Step 1: Toggle component**

```tsx
// src/components/ExpandToggle.tsx
import { useState } from 'react';
export default function ExpandToggle() {
  const [mode, setMode] = useState<'compressed' | 'expanded'>('compressed');
  function toggle(next: 'compressed' | 'expanded') {
    setMode(next);
    const url = new URL(window.location.href);
    if (next === 'expanded') url.searchParams.set('expand', 'all'); else url.searchParams.delete('expand');
    window.history.replaceState({}, '', url.toString());
    document.querySelectorAll('details, [data-annex]').forEach((el) => {
      if (next === 'expanded') (el as HTMLElement).setAttribute('open', '');
      else (el as HTMLElement).removeAttribute('open');
    });
    // For our React envelopes, dispatch a custom event
    window.dispatchEvent(new CustomEvent('toggle-all', { detail: next }));
  }
  return (
    <div className="font-mono text-xs flex gap-2 sticky top-12 z-20 bg-paper border-2 border-ink-black p-2 w-fit ml-auto mr-8">
      <button onClick={() => toggle('compressed')} className={`px-3 py-1 ${mode==='compressed' ? 'bg-ink-black text-paper' : ''}`}>▭▭▭ COMPRESSED</button>
      <button onClick={() => toggle('expanded')} className={`px-3 py-1 ${mode==='expanded' ? 'bg-ink-black text-paper' : ''}`}>▭▭▭▭▭ EXPANDED</button>
    </div>
  );
}
```

**Step 2: Mount in `CaseStudy.astro`**

Add after `<header>`:
```astro
<ExpandToggle client:load />
```

Import:
```astro
import ExpandToggle from '../components/ExpandToggle.tsx';
```

**Step 3: Listen in `EnvelopeAnnex.tsx`**

Add inside the first useEffect:
```tsx
const handler = (e: Event) => setOpen((e as CustomEvent).detail === 'expanded');
window.addEventListener('toggle-all', handler);
return () => window.removeEventListener('toggle-all', handler);
```

**Step 4: Verify**

Visit `/work/dova`. Click EXPANDED. Expected: SYSTEM MAP annex (and any others) open simultaneously. URL becomes `?expand=all`. Click COMPRESSED, all close.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: page-wide compressed/expanded toggle"
```

---

### Task 24: Print stylesheet (force-expand on print)

**Files:**
- Create: `src/styles/print.css`
- Modify: `src/styles/global.css`

**Step 1: Print CSS**

```css
/* src/styles/print.css */
@media print {
  body { background: white !important; color: black !important; cursor: auto !important; }
  #reg-cursor, #red-wedge, .top-strip, .ink-strip { display: none !important; }
  details, [data-annex], [aria-controls] + div { display: block !important; opacity: 1 !important; clip-path: none !important; }
  * { animation: none !important; transition: none !important; transform: none !important; }
  a::after { content: ' (' attr(href) ')'; font-size: 0.8em; color: #666; }
}
```

**Step 2: Import**

Add to `global.css`: `@import './print.css';`

**Step 3: Verify**

In Chrome devtools → Rendering → Emulate CSS media type: print. Reload `/work/dova`. Expected: clean BW-ish layout, cursor visible, all annexes expanded, links show URLs.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: print stylesheet expands all annexes"
```

---

## Phase 4 — Hero stub pages (placeholder content; user fills assets later)

### Task 25: Loopline stub

**Files:**
- Create: `src/pages/work/loopline.mdx`

**Step 1: Write stub**

```mdx
---
layout: ../../layouts/CaseStudy.astro
title: LOOPLINE
year: 2026
role: Solo
stack: Phaser 3 · Capacitor · TypeScript · iOS
status: LIVE on App Store
prev: { href: '/work/dova', label: 'DOVA' }
next: { href: '/work/prodriver', label: 'PRODRIVER' }
---

import HalftoneImage from '../../components/HalftoneImage.astro';
import EnvelopeAnnex from '../../components/EnvelopeAnnex.tsx';

<span class="section-num">§ 02 · HERO MEDIA</span>
<HalftoneImage src="/lab/sample.jpg" alt="Loopline gameplay" />

## CONTEXT
[200 words placeholder]

## APPROACH
- [decision 1]
- [decision 2]
- [decision 3]

<EnvelopeAnnex client:load id="04A" num="04A" title="SHIP LOG" summary="1.0 → 1.1 (Tron neon) → 1.2 (Expedition) version timeline with commit counts and screenshots. Expand for the full ship log.">
  <p class="font-mono">[placeholder for version timeline]</p>
</EnvelopeAnnex>

## EXECUTION
[300 words placeholder]

## OUTCOME
- App Store: [link]
- Downloads: [number]
- IAP conversion: [%]
```

**Step 2: Verify**

Visit `/work/loopline`. Expected: same layout pattern as Dova with Loopline content, prev/next nav points to Dova/ProDriver.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: loopline case study stub"
```

---

### Task 26: ProDriver Hub stub

**Files:**
- Create: `src/pages/work/prodriver.mdx`

**Step 1: Write stub** — same pattern as Loopline, with annex `04A · PLATFORM MATRIX`, prev=loopline, next=latent.

**Step 2: Verify** `/work/prodriver` renders.

**Step 3: Commit**

```bash
git commit -am "feat: prodriver case study stub"
```

---

### Task 27: latent stub

**Files:**
- Create: `src/pages/work/latent.mdx`

**Step 1: Write stub** — annex `04A · BEFORE/AFTER SLIDER`, prev=prodriver, next=null.

**Step 2: Verify** `/work/latent` renders.

**Step 3: Commit**

```bash
git commit -am "feat: latent case study stub"
```

---

## Phase 5 — Archive page

### Task 28: Archive data file + filter logic

**Files:**
- Create: `src/data/archive.ts`
- Test: `tests/unit/archive-filter.test.ts`

**Step 1: Data**

```ts
// src/data/archive.ts
export type ArchiveItem = {
  slug: string; name: string; tag: 'GAME' | 'TOOL' | 'AI' | 'WEB';
  year: number; href: string; thumb: string; tagline: string;
};
export const archiveItems: ArchiveItem[] = [
  // 23 placeholders — user provides real list later
  ...Array.from({ length: 23 }).map((_, i) => ({
    slug: `item-${i+1}`,
    name: `WORK ${String(i+1).padStart(2,'0')}`,
    tag: (['GAME','TOOL','AI','WEB'] as const)[i%4],
    year: 2024 + (i%3),
    href: '#',
    thumb: '/lab/sample.jpg',
    tagline: 'placeholder tagline',
  })),
];
```

**Step 2: Filter helper test**

```ts
// tests/unit/archive-filter.test.ts
import { test, expect } from 'vitest';
import { filterArchive } from '../../src/lib/archive';
import { archiveItems } from '../../src/data/archive';

test('returns all when filter is null', () => {
  expect(filterArchive(archiveItems, null).length).toBe(archiveItems.length);
});
test('filters by tag', () => {
  const games = filterArchive(archiveItems, 'GAME');
  expect(games.every(i => i.tag === 'GAME')).toBe(true);
});
```

**Step 3: Run, fail, implement**

```ts
// src/lib/archive.ts
import type { ArchiveItem } from '../data/archive';
export function filterArchive(items: ArchiveItem[], tag: ArchiveItem['tag'] | null): ArchiveItem[] {
  if (!tag) return items;
  return items.filter((i) => i.tag === tag);
}
```

Run `npm test`. Expected: pass.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: archive data + filter helper"
```

---

### Task 29: Archive page with TiltGrid + filter

**Files:**
- Create: `src/pages/archive.astro`, `src/components/ArchiveGrid.tsx`

**Step 1: ArchiveGrid React island**

```tsx
// src/components/ArchiveGrid.tsx
import { useState } from 'react';
import { archiveItems, type ArchiveItem } from '../data/archive';
import { filterArchive } from '../lib/archive';
import { gsap } from 'gsap';
import { useRef } from 'react';
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
```

**Step 2: Page**

```astro
---
import Base from '../layouts/Base.astro';
import ArchiveGrid from '../components/ArchiveGrid.tsx';
---
<Base title="ARCHIVE / 23">
  <main class="bg-ink-black text-paper min-h-screen px-8 py-16">
    <header class="mb-16">
      <span class="font-mono text-ink-red text-xs">§ ARCHIVE · 23</span>
      <h1 class="font-display text-9xl mt-4 -rotate-1">EVERYTHING</h1>
      <p class="font-mono text-sm mt-4 max-w-md">All shipped repos. Every dead-end. Filter by category.</p>
    </header>
    <ArchiveGrid client:load />
    <a href="/" class="font-mono text-ink-red mt-16 inline-block">← HOME</a>
  </main>
</Base>
```

**Step 3: Verify**

Visit `/archive`. Expected: 23 cards on dark background, filter chips work, hover fans neighbour cards out, click filter narrows.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: archive page with filter + tilt grid"
```

---

## Phase 6 — Polish + ship

### Task 30: 404 page (constructivist)

**Files:**
- Create: `src/pages/404.astro`

**Step 1: 404 page**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="404 / MISPRINT">
  <main class="bg-paper min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
    <svg class="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points="0,0 100,0 50,100" fill="#8B1A1A"/>
    </svg>
    <div class="relative z-10 text-center">
      <div class="font-mono text-ink-red text-sm mb-4">§ ERROR · 404</div>
      <h1 class="font-display text-[20vw] leading-none -rotate-3">MISPRINT</h1>
      <p class="font-mono mt-8">Page not in the print run.</p>
      <a href="/" class="font-mono text-ink-red mt-4 inline-block">← BACK TO HOME</a>
    </div>
  </main>
</Base>
```

**Step 2: Verify** by visiting `/anything-fake`.

**Step 3: Commit**

```bash
git commit -am "feat: 404 misprint page"
```

---

### Task 31: SEO meta + OG image

**Files:**
- Modify: `src/layouts/Base.astro`
- Create: `src/components/SEO.astro`

**Step 1: SEO component**

```astro
---
// src/components/SEO.astro
const { title = 'CHUI SIU FAI', description = 'Designer / engineer / auteur. Hong Kong.', image = '/og.png' } = Astro.props;
const url = new URL(Astro.url.pathname, Astro.site || 'http://localhost:4321');
---
<title>{title}</title>
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image} />
<meta property="og:url" content={url} />
<meta name="twitter:card" content="summary_large_image" />
```

**Step 2: Static OG image**

For now, hand-design `public/og.png` (1200×630) — black background, big red CHUI SIU FAI in Tusker, ⊕ marks. (Or leave as TODO until user provides.)

**Step 3: Mount in `Base.astro`**

```astro
import SEO from '../components/SEO.astro';
// in head:
<SEO title={title} />
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: SEO meta + OG placeholder"
```

---

### Task 32: Lighthouse + a11y pass

**Files:**
- Create: `tests/e2e/a11y.spec.ts`

**Step 1: Install axe**

```bash
npm install -D @axe-core/playwright
```

**Step 2: a11y test**

```ts
// tests/e2e/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/work/dova', '/work/loopline', '/work/prodriver', '/work/latent', '/archive', '/lab'];

for (const path of pages) {
  test(`a11y: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}
```

**Step 3: Run**

```bash
npm run test:e2e -- a11y
```
Fix any criticals reported (likely contrast on red-on-yellow, missing alts, button-without-name).

**Step 4: Lighthouse manually**

In Chrome devtools → Lighthouse → run Performance + Accessibility on `/`. Goal: Performance ≥ 90, A11y ≥ 95. Address regressions (image sizing, font-display, JS island bloat).

**Step 5: Commit**

```bash
git add -A
git commit -m "test: a11y e2e + lighthouse pass"
```

---

### Task 33: Domain hookup + production deploy

**Files:**
- Modify: `astro.config.mjs` (add `site`)

**Step 1: Buy + configure domain**

User action — buy `chuisiufai.com` (or chosen). In Cloudflare Pages → Custom domains → add → DNS auto-config.

**Step 2: Set site in `astro.config.mjs`**

```js
export default defineConfig({
  site: 'https://chuisiufai.com',
  // ...
});
```

**Step 3: Push, verify**

```bash
git commit -am "chore: set production site URL"
git push
```

Wait for CF deploy. Visit live domain. Expected: full site loads, all routes work, OG meta points to production URL.

---

### Task 34: README finalization

**Files:**
- Modify: `README.md`

**Step 1: Final README**

```md
# portfolio

純血構成主義 portfolio · CHUI SIU FAI

## Stack
Astro 4 · React · GSAP · Lenis · Tailwind · MDX · Cloudflare Pages

## Develop
- `npm run dev` — local at :4321
- `npm test` — unit tests
- `npm run test:e2e` — Playwright

## Structure
- `src/pages/` — routes
- `src/components/` — UI primitives + the 10 animation tricks
- `src/pages/lab/` — animation showcases (also useful as visual regression catalogue)
- `src/pages/work/` — case studies (MDX)
- `docs/plans/` — design + implementation docs

## Design tokens (Iron Law)
- Colors: `#8B1A1A` ink-red · `#0A0A0A` ink-black · `#F4EFE6` paper · `#E8C547` ink-yellow (only)
- No gradients · no rounded corners · no fade transitions

## Deploy
Push to main → Cloudflare Pages auto-builds → chuisiufai.com
```

**Step 2: Commit**

```bash
git commit -am "docs: finalize README"
git push
```

---

## Asset Swap Plan (after user provides real content)

These tasks happen later when素材 arrives. Each is just file replacement, no code changes:

- **A1:** Drop hero loop videos / screenshots into `public/work/<project>/hero.{mp4,jpg}`, update `src` props in 4 hero MDX files
- **A2:** Replace placeholder copy in 4 MDX files (CONTEXT / APPROACH / EXECUTION / OUTCOME)
- **A3:** Replace `src/data/archive.ts` placeholders with real 23 items
- **A4:** Replace annex placeholders with real content:
  - Dova: SVG system map (`src/components/annex/DovaSystemMap.astro`)
  - Loopline: version timeline component (`LooplineShipLog.tsx`)
  - ProDriver: platform matrix table component
  - latent: before/after slider component
- **A5:** Replace `public/og.png` with real OG card

---

## Out of scope (decided in design phase)

- Blog
- Dark mode toggle
- i18n switcher
- CMS
- Detailed analytics

---

## Definition of Done

- [ ] All 6 routes live on chuisiufai.com
- [ ] All 10 animation tricks work + respect `prefers-reduced-motion`
- [ ] Lighthouse Performance ≥ 90, A11y ≥ 95
- [ ] All 4 hero pages have at least placeholder content (real content per A1–A4 later)
- [ ] Print stylesheet works (Cmd+P → readable)
- [ ] Direct-link `?expand=04A` opens annex on load
- [ ] No raw hex colors anywhere except design tokens
- [ ] No rounded corners except registration cursor

---

## Reference Skills

- `superpowers:executing-plans` — required for execution
- `superpowers:test-driven-development` — for tasks that include unit tests
- `superpowers:verification-before-completion` — verify each task before marking done
