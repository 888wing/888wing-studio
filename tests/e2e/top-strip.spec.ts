import { test, expect } from '@playwright/test';
test('top strip mounts with REC indicator', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=●REC')).toBeVisible();
  await expect(page.locator('text=PORTFOLIO / 2026')).toBeVisible();
  // wait for clock to tick (initial is --:--:--)
  await page.waitForTimeout(1500);
  const text = await page.textContent('body');
  // HKT clock should display HH:MM:SS format
  expect(text).toMatch(/HKT \d{2}:\d{2}:\d{2}/);
});
