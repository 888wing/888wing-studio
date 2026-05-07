import { test, expect } from '@playwright/test';

test('homepage shows all 6 sections', async ({ page }) => {
  await page.goto('/');
  // hero
  await expect(page.getByRole('heading', { name: 'CHUI SIU FAI', level: 1 })).toBeVisible();
  // manifesto label
  await expect(page.getByText('§ MANIFESTO')).toBeVisible();
  // hero 4 cards
  await expect(page.getByRole('heading', { name: 'DOVA TRAVEL' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'LOOPLINE' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'PRODRIVER HUB' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'LATENT' })).toBeVisible();
  // archive teaser
  await expect(page.getByRole('heading', { name: '23 MORE' })).toBeVisible();
  // colophon
  await expect(page.getByText('⊕ COLOPHON')).toBeVisible();
});
