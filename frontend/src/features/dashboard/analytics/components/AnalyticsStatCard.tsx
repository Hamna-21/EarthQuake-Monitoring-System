import React from 'react';
import AppCard from '@/features/dashboard/components/common/AppCard';

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
    <AppCard variant="glass" className="geo-kpi-card geo-card-hover group relative overflow-hidden p-3.5 transition-transform hover:-translate-y-0.5">
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-30`} />
      <div className="relative flex items-center gap-2">
        <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg ${glow}`}>
          {icon}
        </span>
        <p className="font-serif text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      </div>
      <p className={`relative mt-2.5 bg-gradient-to-r ${gradient} bg-clip-text font-serif text-2xl font-black tracking-tight text-transparent`}>
        {value}
      </p>
      <p className="relative mt-1 text-[11px] font-semibold text-slate-500">{help}</p>
    </AppCard>
  );
}
