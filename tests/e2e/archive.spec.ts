import { test, expect } from '@playwright/test';
import { waitHydrated } from './helpers';

test('archive shows 23 items by default', async ({ page }) => {
  await page.goto('/archive');
  await expect(page.getByRole('heading', { name: 'EVERYTHING', level: 1 })).toBeVisible();
  await expect(page.getByText('23 ITEMS')).toBeVisible();
  await expect(page.locator('[data-card]')).toHaveCount(23);
});

test('GAME filter narrows the grid', async ({ page }) => {
  await page.goto('/archive');
  const gameBtn = page.getByRole('button', { name: 'GAME' });
  await waitHydrated(page, gameBtn);
  await gameBtn.click();
  await expect(page.locator('[data-card]')).toHaveCount(6);
  await expect(page.getByText('6 ITEMS')).toBeVisible();
});
