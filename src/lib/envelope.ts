export function shouldStartOpen(id: string, search: string = '', hash: string = ''): boolean {
  const params = new URLSearchParams(search);
  const expand = params.get('expand');
  if (expand === 'all' || expand === id) return true;
  if (hash === `#${id}` || hash.replace(/^#/, '') === id) return true;
  return false;
}
