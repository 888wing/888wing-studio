import { test, expect } from '@playwright/test';

test('red wedge mounts globally', async ({ page }) => {
  await page.goto('/lab/red-wedge');
  await expect(page.locator('#red-wedge')).toBeAttached();
});

test('red wedge scales as user scrolls', async ({ page }) => {
  await page.goto('/lab/red-wedge');
  await page.waitForTimeout(300);
  // initial scale should be 0 or near 0
  const initial = await page.locator('#red-wedge').evaluate((el) =>
    (el as HTMLElement).style.transform || ''
  );
  // scroll halfway down
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(500);
  const after = await page.locator('#red-wedge').evaluate((el) =>
    (el as HTMLElement).style.transform || ''
  );
  expect(after).not.toBe(initial);
});
