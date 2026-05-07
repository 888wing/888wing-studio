export type ArchiveItem = {
  slug: string; name: string; tag: 'GAME' | 'TOOL' | 'AI' | 'WEB';
  year: number; href: string; thumb: string; tagline: string;
};
export const archiveItems: ArchiveItem[] = [
  ...Array.from({ length: 23 }).map((_, i) => ({
    slug: `item-${i+1}`,
    name: `WORK ${String(i+1).padStart(2,'0')}`,
    tag: (['GAME','TOOL','AI','WEB'] as const)[i%4],
    year: 2024 + (i%3),
    href: '#',
    thumb: '/lab/sample.jpg',
    tagline: 'placeholder tagline',
  })),
];
