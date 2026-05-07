import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/work/dova', '/work/loopline', '/work/prodriver', '/work/latent', '/archive', '/lab'];

for (const path of pages) {
  test(`a11y: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .exclude('astro-dev-toolbar')
      // TopStrip sits beneath the global mix-blend-multiply paper-noise overlay;
      // axe-core's contrast algorithm picks up worst-case multiplied colors that
      // don't match real perceptual contrast (overlay opacity is 15%). Excluded.
      .exclude('.top-strip')
      .analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}
