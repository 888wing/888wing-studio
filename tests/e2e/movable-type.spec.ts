import { test, expect } from '@playwright/test';

test('movable type renders all chars', async ({ page }) => {
  await page.goto('/lab/movable-type');
  // sr-only span should contain full text
  await expect(page.locator('.sr-only').filter({ hasText: 'LOOPLINE' })).toBeAttached();
  // each character span should exist
  const chars = await page.locator('[data-char]').count();
  expect(chars).toBe('LOOPLINE'.length);
});
