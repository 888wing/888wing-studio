import type { Page, Locator } from '@playwright/test';

/**
 * Wait for a React island to fully hydrate before interacting.
 * Astro emits `astro:hydrate` event when an island finishes hydration.
 * As a fallback, also wait for the locator's click handler to be attached.
 */
export async function waitHydrated(page: Page, locator: Locator) {
  await locator.waitFor({ state: 'visible' });
  // Astro islands set ssr="" attribute during render and remove it on hydration
  // Check the closest astro-island parent has had its ssr attribute removed
  await page.evaluate(async (sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const island = el.closest('astro-island');
    if (!island) return;
    // Wait until the ssr attribute is removed (means hydration done)
    if (!island.hasAttribute('ssr')) return;
    await new Promise<void>((resolve) => {
      const observer = new MutationObserver(() => {
        if (!island.hasAttribute('ssr')) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(island, { attributes: true, attributeFilter: ['ssr'] });
      // safety timeout
      setTimeout(() => { observer.disconnect(); resolve(); }, 5000);
    });
  }, await locator.evaluate(el => {
    // Build a unique selector for this element (use id if present, or tag+text)
    if (el.id) return `#${CSS.escape(el.id)}`;
    return el.tagName.toLowerCase();
  }));
}
