import { ReactNode } from 'react';

type PredictionMetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  detail: string;
  accent?: boolean;
};

export default function PredictionMetricCard({ icon, label, value, detail, accent = false }: PredictionMetricCardProps) {
  const tone = accent
    ? 'border-rose-400/30 bg-gradient-to-br from-rose-500/20 via-rose-950/20 to-orange-500/10 text-rose-100 shadow-[0_18px_40px_rgba(244,63,94,0.12)]'
    : 'border-white/10 bg-white/[0.05] text-white';

  return (
    <article
      className={`group aspect-square rounded-xl border p-2.5 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-[0_18px_45px_rgba(0,0,0,0.28)] ${tone}`}
    >
      <div className="flex h-full flex-col justify-between gap-2">
        <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] ${accent ? 'text-rose-50' : 'text-cyan-100'}`}>
          <span className="shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        <div className="space-y-0.5">
          <p className="font-serif text-[1.9rem] font-black leading-none text-white">{value}</p>
          <p className="text-[10px] font-semibold leading-4 text-slate-300">{detail}</p>
        </div>
      </div>
    </article>
  );
}
