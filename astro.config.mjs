import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // TODO: replace with custom domain once Task 33b lands
  site: 'https://888wing-studio.pages.dev',
  integrations: [react(), mdx(), tailwind({ applyBaseStyles: false })],
  vite: { ssr: { noExternal: ['gsap'] } },
});
