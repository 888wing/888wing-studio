import { test, expect } from '@playwright/test';
test('tilt grid renders 12 cards', async ({ page }) => {
  await page.goto('/lab/grid-tilt');
  await expect(page.locator('[data-card]')).toHaveCount(12);
});
test('hover tilts neighbors', async ({ page }) => {
  await page.goto('/lab/grid-tilt');
  // wait for React island to hydrate (onMouseEnter handler attached)
  await page.waitForLoadState('networkidle');
  // hover middle card
  await page.locator('[data-card]').nth(5).hover();
  // Poll until GSAP applies a transform (max 2s) — robust against slow hydration
  // when dev server is loaded by parallel test workers.
  await expect
    .poll(
      async () =>
        page.locator('[data-card]').first().evaluate((el) =>
          getComputedStyle(el as HTMLElement).transform
        ),
      { timeout: 2000 }
    )
    .not.toBe('none');
});
