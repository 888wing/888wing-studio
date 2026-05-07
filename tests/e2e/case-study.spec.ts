import { test, expect } from '@playwright/test';

test('dova case study renders', async ({ page }) => {
  await page.goto('/work/dova');
  await expect(page.getByRole('heading', { name: 'DOVA TRAVEL', level: 1 })).toBeVisible();
  // metadata strip
  await expect(page.getByText('YEAR')).toBeVisible();
  await expect(page.getByText('STACK')).toBeVisible();
  // section heading from MDX
  await expect(page.getByRole('heading', { name: 'CONTEXT' })).toBeVisible();
  // next nav (no prev)
  await expect(page.getByText('LOOPLINE →')).toBeVisible();
});
