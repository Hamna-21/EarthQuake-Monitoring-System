import { LucideIcon } from 'lucide-react';

export default function OverviewStatCard({ label, caption, value, icon: Icon, gradient, glow, toneChip, tag, bars }: { label: string; caption: string; value: string | number; icon: LucideIcon; gradient: string; glow: string; toneChip: string; tag: string; bars: number[]; }) {
  return (
    <article className={`group relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.07] p-5 shadow-sm ring-1 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glow}`}>
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.14]`} />
      <div className="relative flex items-center justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}><Icon className="h-5 w-5" /></span>
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${toneChip}`}>{tag}</span>
      </div>
      <p className="relative mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <strong className="relative mt-1 block font-serif text-3xl font-black tracking-tight text-white">{value}</strong>
      <p className="relative mt-1 text-xs font-semibold text-slate-400">{caption}</p>
      <div className="relative mt-5 flex h-8 items-end gap-1">{bars.map((height, index) => <span key={index} className={`w-full rounded-t bg-gradient-to-t ${gradient} opacity-70 transition-opacity duration-300 group-hover:opacity-100`} style={{ height: `${height}%` }} />)}</div>
    </article>
  );
}



