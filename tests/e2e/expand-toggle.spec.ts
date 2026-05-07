import { test, expect } from '@playwright/test';
import { waitHydrated } from './helpers';

test('expand toggle opens all annexes', async ({ page }) => {
  await page.goto('/work/dova');
  const expandBtn = page.getByRole('button', { name: /EXPANDED/ });
  await waitHydrated(page, expandBtn);
  await expandBtn.click();
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'true');
  // URL should reflect ?expand=all
  expect(page.url()).toContain('expand=all');
});

test('compressed toggle closes all annexes', async ({ page }) => {
  await page.goto('/work/dova?expand=all');
  // initial: SYSTEM MAP open
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: /COMPRESSED/ }).click();
  await expect(page.getByRole('button', { name: /SYSTEM MAP/ })).toHaveAttribute('aria-expanded', 'false');
  expect(page.url()).not.toContain('expand=');
});
