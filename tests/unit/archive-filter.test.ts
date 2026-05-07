import { test, expect } from 'vitest';
import { filterArchive } from '../../src/lib/archive';
import { archiveItems } from '../../src/data/archive';

test('returns all when filter is null', () => {
  expect(filterArchive(archiveItems, null).length).toBe(archiveItems.length);
});
test('filters by tag', () => {
  const games = filterArchive(archiveItems, 'GAME');
  expect(games.every(i => i.tag === 'GAME')).toBe(true);
});
