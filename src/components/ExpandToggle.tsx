import { useState } from 'react';
export default function ExpandToggle() {
  const [mode, setMode] = useState<'compressed' | 'expanded'>('compressed');
  function toggle(next: 'compressed' | 'expanded') {
    setMode(next);
    const url = new URL(window.location.href);
    if (next === 'expanded') url.searchParams.set('expand', 'all'); else url.searchParams.delete('expand');
    window.history.replaceState({}, '', url.toString());
    // For React envelopes, dispatch a custom event
    window.dispatchEvent(new CustomEvent('toggle-all', { detail: next }));
  }
  return (
    <div className="font-mono text-xs flex gap-2 sticky top-12 z-20 bg-paper border-2 border-ink-black p-2 w-fit ml-auto mr-8">
      <button onClick={() => toggle('compressed')} className={`px-3 py-1 ${mode==='compressed' ? 'bg-ink-black text-paper' : ''}`}>▭▭▭ COMPRESSED</button>
      <button onClick={() => toggle('expanded')} className={`px-3 py-1 ${mode==='expanded' ? 'bg-ink-black text-paper' : ''}`}>▭▭▭▭▭ EXPANDED</button>
    </div>
  );
}
