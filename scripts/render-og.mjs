// Renders public/og.svg into a 1200x630 raster PNG for og:image.
// Run with: node scripts/render-og.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const svgPath = path.resolve(__dirname, '..', 'public', 'og.svg');
  const svgContent = readFileSync(svgPath, 'utf8');
  // Inline the SVG directly so font rendering and viewport sizing work reliably.
  const html = `<!doctype html>
    <html>
      <head>
        <style>
          html, body { margin:0; padding:0; background:#F4EFE6; }
          svg { display:block; width:1200px; height:630px; }
        </style>
      </head>
      <body>${svgContent}</body>
    </html>`;
  await page.setContent(html, { waitUntil: 'networkidle' });
  // give web fonts a moment if any loaded
  await page.waitForTimeout(200);
  const out = path.resolve(__dirname, '..', 'public', 'og.png');
  await page.screenshot({
    path: out,
    type: 'png',
    omitBackground: false,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  await browser.close();
  console.log(`Wrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
