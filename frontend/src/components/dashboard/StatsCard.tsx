import React from 'react';
import { Activity, AlertTriangle, BarChart3, Globe2 } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string;
  detail: string;
  tone: 'red' | 'maroon' | 'orange' | 'rose';
}

const toneStyles = {
  red: {
    icon: 'bg-red-100 text-red-700',
    value: 'text-red-700',
    glow: 'from-red-500/10'
  },
  maroon: {
    icon: 'bg-[#f6dddd] text-[#4b0f12]',
    value: 'text-[#4b0f12]',
    glow: 'from-[#4b0f12]/10'
  },
  orange: {
    icon: 'bg-orange-100 text-orange-700',
    value: 'text-orange-700',
    glow: 'from-orange-500/10'
  },
  rose: {
    icon: 'bg-rose-100 text-rose-700',
    value: 'text-rose-700',
    glow: 'from-rose-500/10'
  }
};

const icons = [Activity, AlertTriangle, BarChart3, Globe2];

export default function StatsCard({ label, value, detail, tone }: StatsCardProps) {
  const style = toneStyles[tone];
  const Icon = icons[label.length % icons.length];

  return (
    <article className={`relative overflow-hidden rounded-xl border border-red-100 bg-white/86 p-5 shadow-[0_16px_44px_rgba(127,29,29,0.07)]`}>
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${style.glow} to-transparent`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-500">{label}</p>
          <strong className={`mt-3 block text-4xl font-black italic tracking-tight ${style.value}`}>{value}</strong>
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${style.icon}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="relative mt-4 text-sm font-medium italic leading-6 text-[#7b3438]">{detail}</p>
    </article>
  );
}
