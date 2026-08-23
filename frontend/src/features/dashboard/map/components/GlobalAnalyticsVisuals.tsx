import type { Earthquake } from '@/types';

// Small SVG/CSS visualizations keep the map analytics readable without another chart data source.
export function TrendChart({ data }: { data: { label: string; count: number }[] }) {
  if (!data.length) return <Empty />;
  const max = Math.max(1, ...data.map((item) => item.count));
  return <div className="flex h-[132px] items-end gap-2 rounded-xl border border-white/10 bg-black/10 px-3 pb-3 pt-4">{data.map((item) => <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"><span className="text-[9px] font-bold text-orange-200">{item.count}</span><div className="flex h-[88px] w-full items-end rounded-md bg-white/[0.035]"><div className="w-full rounded-md bg-gradient-to-t from-red-500 to-orange-300" style={{ height: `${Math.max(item.count ? 10 : 2, (item.count / max) * 100)}%` }} /></div><span className="text-[9px] font-bold text-slate-500">{item.label}</span></div>)}</div>;
}

/** Renders or coordinates magnitude columns for this frontend module. */
export function MagnitudeColumns({ data, colors }: { data: [string, number][]; colors: string[] }) {
  const max = Math.max(1, ...data.map(([, count]) => count));
  return <div className="flex h-[132px] items-end gap-2 rounded-xl border border-white/10 bg-black/10 px-2 pb-2 pt-3">{data.map(([label, count], index) => <div key={label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"><span className="font-serif text-[10px] font-black text-orange-100">{count}</span><div className="flex h-[86px] w-full items-end rounded-t-md bg-white/[0.04]"><div className="w-full rounded-t-md" style={{ height: `${count ? Math.max(8, (count / max) * 100) : 3}%`, background: `linear-gradient(to top, ${colors[index % colors.length]}, #fde68a)` }} /></div><span className="whitespace-nowrap font-serif text-[9px] font-bold text-slate-400">{label}</span></div>)}</div>;
}

/** Renders or coordinates depth donut for this frontend module. */
export function DepthDonut({ data, colors }: { data: [string, number][]; colors: string[] }) {
  const total = Math.max(1, data.reduce((sum, [, count]) => sum + count, 0)); let offset = 0;
  const segments = data.map(([, count], index) => { const start = offset; offset += (count / total) * 100; return `${colors[index % colors.length]} ${start}% ${offset}%`; }).join(', ');
  return <div className="flex h-[132px] items-center gap-3 rounded-xl border border-white/10 bg-black/10 px-3"><div className="relative h-24 w-24 shrink-0 rounded-full" style={{ background: `conic-gradient(${segments})` }}><div className="absolute inset-[18px] flex items-center justify-center rounded-full bg-[#101827] font-serif text-sm font-black text-white">{total}</div></div><div className="min-w-0 flex-1 space-y-2">{data.map(([label, count], index) => <div key={label} className="flex items-center justify-between gap-2 font-serif text-[10px]"><span className="flex min-w-0 items-center gap-1.5 text-slate-300"><i className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />{label}</span><b className="shrink-0 text-violet-100">{count}</b></div>)}</div></div>;
}

/** Renders or coordinates scatter chart for this frontend module. */
export function ScatterChart({ events, maxMagnitude, maxDepth }: { events: Earthquake[]; maxMagnitude: number; maxDepth: number }) {
  if (!events.length) return <Empty />;
  return <svg viewBox="0 0 320 132" className="h-[126px] w-full overflow-visible rounded-xl border border-white/10 bg-black/10 p-2" role="img" aria-label="Depth versus magnitude chart"><line x1="24" y1="8" x2="24" y2="112" stroke="rgba(255,255,255,.16)" /><line x1="24" y1="112" x2="312" y2="112" stroke="rgba(255,255,255,.16)" />{events.slice(0, 160).map((event) => <circle key={event.id} cx={28 + (Math.min(maxDepth, Math.max(0, event.depth)) / maxDepth) * 278} cy={108 - (Math.min(maxMagnitude, Math.max(0, event.magnitude)) / maxMagnitude) * 94} r={event.magnitude >= 6 ? 3 : 2} fill={event.magnitude >= 6 ? '#ef4444' : event.magnitude >= 4 ? '#f97316' : '#fbbf24'} opacity=".78" />)}<text x="25" y="127" fill="#64748b" fontSize="9">shallow</text><text x="274" y="127" fill="#64748b" fontSize="9">deep</text><text x="4" y="16" fill="#64748b" fontSize="9">high</text><text x="3" y="109" fill="#64748b" fontSize="9">low</text></svg>;
}

/** Renders or coordinates strongest list for this frontend module. */
export function StrongestList({ events }: { events: Earthquake[] }) { if (!events.length) return <Empty />; return <div className="space-y-2.5">{events.map((event) => <div key={event.id} className="flex items-start gap-2"><span className="shrink-0 rounded-md bg-orange-400/15 px-1.5 py-1 text-[10px] font-black text-orange-200">M{event.magnitude.toFixed(1)}</span><span className="min-w-0 flex-1 break-words font-serif text-[11px] font-semibold leading-tight text-slate-200">{event.place}</span><span className="shrink-0 pt-1 text-[10px] text-slate-400">{event.depth.toFixed(0)} km</span></div>)}</div>; }
/** Renders or coordinates empty for this frontend module. */
export function Empty() { return <p className="pt-6 text-xs font-semibold text-slate-500">No earthquake data available.</p>; }
