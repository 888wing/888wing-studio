import { test, expect } from '@playwright/test';

test('press assembly reveals content', async ({ page }) => {
  await page.goto('/lab/press-assembly');
  await page.waitForTimeout(900); // wait past 0.6s reveal
  await expect(page.locator('h2', { hasText: 'DOVA' })).toBeVisible();
  // cover should have slid off
  const coverTransform = await page
    .locator('[data-cover]')
    .evaluate((el) => getComputedStyle(el).transform);
  // off-screen means matrix transform with negative tx
  expect(coverTransform).not.toBe('none');
});
