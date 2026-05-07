import { test, expect } from '@playwright/test';
test('ink bleed buttons render', async ({ page }) => {
  await page.goto('/lab/ink-bleed');
  await expect(page.locator('button.ink-btn', { hasText: 'VIEW WORK' })).toBeVisible();
  await expect(page.locator('a.ink-btn', { hasText: 'back' })).toBeVisible();
});
