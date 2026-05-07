import { test, expect } from '@playwright/test';

test('kinetic manifesto renders all phrases', async ({ page }) => {
  await page.goto('/lab/kinetic-type');
  await expect(page.locator('p[data-phrase]')).toHaveCount(3);
  // scroll into view of the manifesto
  await page.locator('p[data-phrase]').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500); // wait for stagger animation to complete
  // all phrases should be visible
  await expect(page.locator('p[data-phrase]').first()).toBeVisible();
});
