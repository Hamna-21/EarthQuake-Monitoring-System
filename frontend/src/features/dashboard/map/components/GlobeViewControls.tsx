import { useState } from 'react';
import type { View } from './globeData';

const labels = {
  satellite: 'Satellite',
  terrain: 'Terrain',
  night: 'Night',
} satisfies Record<'satellite' | 'terrain' | 'night', string>;
export default function GlobeViewControls({
  view,
  onChange,
}: {
  view: View;
  onChange: (view: View) => void;
}) {
  const [open, setOpen] = useState(false);
  return <div className="relative w-28 font-serif">
    <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-slate-950/85 px-2.5 py-1.5 text-[11px] font-semibold text-slate-100 shadow-lg backdrop-blur-xl transition hover:bg-white/10"><span>{labels[view]}</span><span className="text-[9px] text-slate-400">{open ? '▲' : '▼'}</span></button>
    {open && <div className="absolute right-0 top-full z-40 mt-1 w-full rounded-lg border border-white/10 bg-slate-950/95 p-1 shadow-xl backdrop-blur-xl">{(Object.keys(labels) as Array<keyof typeof labels>).map((item) => <button key={item} type="button" onClick={() => { onChange(item); setOpen(false); }} className={`block w-full rounded-md px-2.5 py-1.5 text-left text-[11px] font-semibold transition ${view === item ? 'bg-white/10 text-orange-100' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>{labels[item]}</button>)}</div>}
  </div>;
}
