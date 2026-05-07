import { test, expect } from '@playwright/test';

test('loopline stub renders', async ({ page }) => {
  await page.goto('/work/loopline');
  await expect(page.getByRole('heading', { name: 'LOOPLINE', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: /SHIP LOG/ })).toBeVisible();
  await expect(page.getByText('← DOVA')).toBeVisible();
  await expect(page.getByText('PRODRIVER →')).toBeVisible();
});

test('prodriver stub renders', async ({ page }) => {
  await page.goto('/work/prodriver');
  await expect(page.getByRole('heading', { name: 'PRODRIVER HUB', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: /PLATFORM MATRIX/ })).toBeVisible();
  await expect(page.getByText('← LOOPLINE')).toBeVisible();
  await expect(page.getByText('LATENT →')).toBeVisible();
});

test('latent stub renders without next nav', async ({ page }) => {
  await page.goto('/work/latent');
  await expect(page.getByRole('heading', { name: 'LATENT', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: /BEFORE \/ AFTER SLIDER/ })).toBeVisible();
  await expect(page.getByText('← PRODRIVER')).toBeVisible();
  // 'LATENT →' should NOT exist (no next)
  const nextNav = await page.getByText(/→$/).count();
  expect(nextNav).toBe(0);
});
