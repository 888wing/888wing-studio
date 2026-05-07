import { test, expect, vi } from 'vitest';
import { prefersReducedMotion } from '../../src/lib/motion';

test('returns true when matchMedia matches reduce', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  expect(prefersReducedMotion()).toBe(true);
});
test('returns false when matchMedia does not match', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  expect(prefersReducedMotion()).toBe(false);
});
test('returns false in non-browser env', () => {
  vi.stubGlobal('matchMedia', undefined);
  expect(prefersReducedMotion()).toBe(false);
});
