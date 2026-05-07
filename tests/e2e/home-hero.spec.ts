import { test, expect } from '@playwright/test';
test('home hero shows name + tagline + wedge', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'CHUI SIU FAI', level: 1 })).toBeVisible();
  await expect(page.getByText('DESIGNER · ENGINEER · AUTEUR')).toBeVisible();
  // wedge SVG present
  await expect(page.locator('section svg polygon[fill="#8B1A1A"]').first()).toBeAttached();
});

test('hero shows HK GLOBAL badge', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/HK.*GLOBAL/i)).toBeVisible();
});
