import { test, expect } from '@playwright/test';

test('annex starts closed by default', async ({ page }) => {
  await page.goto('/work/dova');
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'false');
});
test('clicking opens the annex', async ({ page }) => {
  await page.goto('/work/dova');
  await page.getByRole('button', { name: /SYSTEM MAP/ }).click();
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'true');
});
test('?expand=04A opens it on load', async ({ page }) => {
  await page.goto('/work/dova?expand=04A');
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'true');
});
test('?expand=all opens it', async ({ page }) => {
  await page.goto('/work/dova?expand=all');
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'true');
});
