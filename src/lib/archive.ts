import type { ArchiveItem } from '../data/archive';
export function filterArchive(items: ArchiveItem[], tag: ArchiveItem['tag'] | null): ArchiveItem[] {
  if (!tag) return items;
  return items.filter((i) => i.tag === tag);
}
