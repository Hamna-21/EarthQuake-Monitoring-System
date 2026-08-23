import { LucideIcon } from 'lucide-react';

/** Renders or coordinates overview stat card for this frontend module. */
export default function OverviewStatCard({ label, caption, value, icon: Icon, gradient, glow, toneChip, tag, bars }: { label: string; caption: string; value: string | number; icon: LucideIcon; gradient: string; glow: string; toneChip: string; tag: string; bars: number[]; }) {
  return (
    <article className={`geo-kpi-card geo-card-hover group relative mb-4 overflow-hidden p-3.5 pb-4 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glow}`}>
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.14]`} />
      <div className="relative flex items-center justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}><Icon className="h-4 w-4" /></span>
        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-black ${toneChip}`}>{tag}</span>
      </div>
      <p className="relative mt-3 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <strong className="relative mt-0.5 block font-serif text-2xl font-black tracking-tight text-white">{value}</strong>
      <p className="relative mt-1 text-xs font-semibold text-slate-400">{caption}</p>
      <div className="relative mt-3 flex h-6 items-end gap-1">{bars.map((height, index) => <span key={index} className={`w-full rounded-t bg-gradient-to-t ${gradient} opacity-70 transition-opacity duration-300 group-hover:opacity-100`} style={{ height: `${height}%` }} />)}</div>
    </article>
  );
}
/** Displays one overview statistic with its supporting label and icon. */
