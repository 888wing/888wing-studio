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
    <div className="top-strip bg-ink-black text-paper font-mono text-xs flex items-center justify-between px-4 py-2 border-b-2 border-ink-red sticky top-0 z-30">
      <span><span className="text-ink-red-bright">●REC</span> &nbsp; HKT {time}</span>
      <span>PORTFOLIO / 2026 / CHUI SIU FAI</span>
      <span>v0.1 · ⊕ ⊕ ⊕</span>
    </div>
  );
}
