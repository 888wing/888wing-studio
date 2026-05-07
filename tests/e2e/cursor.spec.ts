import { test, expect } from '@playwright/test';

test('registration cursor mounts', async ({ page }) => {
  await page.goto('/lab/cursor');
  await expect(page.locator('#reg-cursor')).toBeAttached();
  // Native cursor should be hidden
  const bodyCursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
  expect(bodyCursor).toBe('none');
});
