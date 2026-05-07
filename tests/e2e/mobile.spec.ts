import { test, expect } from '@playwright/test';

// Use a manual mobile viewport so we run on the default chromium browser
// (avoids needing webkit/iPhone 13 device profile to be installed).
test.use({ viewport: { width: 390, height: 844 } });

test('mobile homepage loads without horizontal overflow', async ({ page }) => {
  await page.goto('/');
  // wait for fonts/layout to settle
  await page.waitForLoadState('networkidle');
  const docWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const viewportWidth = page.viewportSize()?.width ?? 0;
  // small tolerance for sub-pixel rounding
  expect(docWidth).toBeLessThanOrEqual(viewportWidth + 1);
});

test('mobile hero text is readable', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'CHUI SIU FAI', level: 1 })).toBeVisible();
});

test('mobile case study shows title', async ({ page }) => {
  await page.goto('/work/dova');
  await expect(page.getByRole('heading', { name: 'DOVA TRAVEL', level: 1 })).toBeVisible();
});
