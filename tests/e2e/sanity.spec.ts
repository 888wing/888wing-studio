import { test, expect } from '@playwright/test';
test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'CHUI SIU FAI', level: 1 })).toBeVisible();
});
