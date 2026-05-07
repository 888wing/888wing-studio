import { test, expect } from '@playwright/test';
test('ink strip mounts with CMYK swatches', async ({ page }) => {
  await page.goto('/lab/ink-strip');
  await expect(page.locator('.ink-strip')).toBeAttached();
  // CMYK = 4 swatches in the static print bar layout
  const swatchCount = await page.locator('.ink-swatch').count();
  expect(swatchCount).toBe(4);
});
