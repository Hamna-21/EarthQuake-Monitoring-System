import React from 'react';

export default function AnalyticsStatCard({
  icon,
  label,
  value,
  help,
  gradient,
  glow,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  help: string;
  gradient: string;
  glow: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-xl transition-transform hover:-translate-y-0.5">
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-30`} />
      <div className="relative flex items-center gap-2">
        <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg ${glow}`}>
          {icon}
        </span>
        <p className="font-serif text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      </div>
      <p className={`relative mt-3 bg-gradient-to-r ${gradient} bg-clip-text font-serif text-3xl font-black tracking-tight text-transparent`}>
        {value}
      </p>
      <p className="relative mt-1 text-[11px] font-semibold text-slate-500">{help}</p>
    </div>
  );
}
