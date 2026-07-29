// components/DetailCard.tsx
import React from 'react';

interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
  glow?: string;
  tint?: string;
  border?: string;
}

export default function DetailCard({
  icon,
  label,
  value,
  gradient,
  glow = 'shadow-cyan-950/40',
  tint = 'from-white/[0.08] to-white/[0.03]',
  border = 'border-white/10',
}: DetailCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${tint} p-4 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-cyan-200/30 hover:shadow-xl`}>
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-20`} />

      <div className="relative flex items-center gap-2">
        <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md ${glow}`}>
          {icon}
        </span>
        <p className="truncate font-serif text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">{label}</p>
      </div>

      <p
        className={`relative mt-3 truncate bg-gradient-to-r ${gradient} bg-clip-text font-serif text-xl font-black tracking-tight text-transparent sm:text-2xl`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

