import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Hong_Kong',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false,
});

export default function TopStrip() {
  const [time, setTime] = useState('--:--:--');
  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="top-strip bg-ink-black text-paper font-mono text-xs flex items-center gap-4 px-4 py-2 border-b-2 border-ink-red sticky top-0 z-30 overflow-hidden whitespace-nowrap">
      <span className="text-ink-red-bright">● REC</span>
      <span>HKT {time}</span>
      <span>PORTFOLIO/2026</span>
      <span
        aria-hidden="true"
        role="presentation"
        className="flex-1 self-center h-px"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, rgba(244,239,230,0.4) 0, rgba(244,239,230,0.4) 8px, transparent 8px, transparent 14px)',
        }}
      ></span>
      <span className="text-paper">BUILDING THINGS. BREAKING PATTERNS. SHIPPING.</span>
    </div>
  );
}
