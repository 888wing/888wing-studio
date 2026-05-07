import { test, expect } from '@playwright/test';

test('print mode forces annex open', async ({ page }) => {
  await page.goto('/work/dova');
  // emulate print media
  await page.emulateMedia({ media: 'print' });
  // envelope body should not have clip-path (id "04A-body" starts with a digit, use attribute selector)
  const body = page.locator('[id="04A-body"]');
  const clipPath = await body.evaluate((el) => getComputedStyle(el).clipPath);
  expect(clipPath === 'none' || clipPath === '').toBe(true);
});
