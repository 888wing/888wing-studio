import { test, expect } from 'vitest';
import { shouldStartOpen } from '../../src/lib/envelope';

test('opens when ?expand matches id', () => {
  expect(shouldStartOpen('04A', '?expand=04A')).toBe(true);
});
test('opens when hash matches id', () => {
  expect(shouldStartOpen('04A', '', '#04A')).toBe(true);
});
test('opens when expand=all', () => {
  expect(shouldStartOpen('04A', '?expand=all')).toBe(true);
});
test('closed otherwise', () => {
  expect(shouldStartOpen('04A', '', '')).toBe(false);
  expect(shouldStartOpen('04A', '?expand=05B', '#06C')).toBe(false);
});
