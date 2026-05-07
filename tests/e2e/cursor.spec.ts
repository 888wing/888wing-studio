import { test, expect } from '@playwright/test';

test('registration cursor mounts and hides native cursor', async ({ page }) => {
  await page.goto('/lab/cursor');
  await expect(page.locator('#reg-cursor')).toBeAttached();
  const bodyCursor = await page.evaluate(() => getComputedStyle(document.body).cursor);
  expect(bodyCursor).toBe('none');
});

test('cursor follows mouse', async ({ page }) => {
  await page.goto('/lab/cursor');
  await page.mouse.move(200, 200);
  // wait one RAF cycle
  await page.waitForTimeout(100);
  const transform = await page.locator('#reg-cursor').evaluate(el => (el as HTMLElement).style.transform);
  // transform should contain a translate near 184, 184 (200 - 16)
  expect(transform).toMatch(/translate\([^)]+\) scale\([^)]+\)/);
  // x should be > 100 (definitely moved from initial -100)
  const match = transform.match(/translate\(([\d.-]+)px/);
  expect(match).not.toBeNull();
  expect(parseFloat(match![1])).toBeGreaterThan(100);
});

test('cursor still tracks after navigation', async ({ page }) => {
  await page.goto('/lab/cursor');
  await page.mouse.move(150, 150);
  await page.waitForTimeout(80);
  // Click the back-to-lab link → triggers astro view transition
  await page.click('a[href="/lab"]');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('#reg-cursor')).toBeAttached();
  const before = await page.locator('#reg-cursor').evaluate(el => (el as HTMLElement).style.transform);
  await page.mouse.move(400, 300);
  await page.waitForTimeout(120);
  const after = await page.locator('#reg-cursor').evaluate(el => (el as HTMLElement).style.transform);
  expect(after).not.toBe(before);
});
