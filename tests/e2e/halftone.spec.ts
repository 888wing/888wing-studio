import { test, expect } from '@playwright/test';
test('halftone image renders', async ({ page }) => {
  await page.goto('/lab/halftone-reveal');
  await expect(page.locator('[data-halftone]')).toBeAttached();
  const img = page.locator('[data-halftone] img');
  await expect(img).toHaveAttribute('alt', 'sample');
});
