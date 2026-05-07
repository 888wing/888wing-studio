import { test, expect } from '@playwright/test';
test('ink strip mounts with swatches', async ({ page }) => {
  await page.goto('/lab/ink-strip');
  await expect(page.locator('.ink-strip')).toBeAttached();
  // 12 * 7 = 84 swatches
  const swatchCount = await page.locator('.ink-swatch').count();
  expect(swatchCount).toBe(84);
});
