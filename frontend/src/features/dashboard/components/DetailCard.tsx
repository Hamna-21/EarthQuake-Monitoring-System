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

/** Renders or coordinates detail card for this frontend module. */
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
    <div className={`group relative flex min-h-[6.5rem] w-full flex-col justify-center overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${tint} p-3 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-cyan-200/30 hover:shadow-xl`}>
      <div className={`pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br ${gradient} opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-20`} />

      <div className="relative flex items-center gap-1.5">
        <span className={`grid h-6 w-6 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md ${glow}`}>
          {icon}
        </span>
        <p className="font-serif text-[9px] font-black uppercase leading-tight tracking-[0.14em] text-slate-300">
          {label}
        </p>
      </div>

      <p
        className={`relative mt-1.5 break-words bg-gradient-to-r ${gradient} bg-clip-text font-serif text-lg font-black leading-snug tracking-tight text-transparent`}
      >
        {value}
      </p>
    </div>
  );
}
