import React from 'react';
import { Activity } from 'lucide-react';

type Tone = 'red' | 'cyan' | 'emerald' | 'violet' | 'amber';

const TONE_STYLES: Record<Tone, { label: string; iconBg: string; iconHover: string; bar: string }> = {
  red: {
    label: 'text-red-200',
    iconBg: 'bg-red-500/15 text-red-100 ring-1 ring-red-300/20',
    iconHover: 'group-hover:bg-red-700 group-hover:text-white',
    bar: 'from-red-600 to-orange-400',
  },
  cyan: {
    label: 'text-cyan-200',
    iconBg: 'bg-cyan-500/15 text-cyan-100 ring-1 ring-cyan-300/20',
    iconHover: 'group-hover:bg-cyan-600 group-hover:text-white',
    bar: 'from-cyan-500 to-blue-500',
  },
  emerald: {
    label: 'text-emerald-200',
    iconBg: 'bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-300/20',
    iconHover: 'group-hover:bg-emerald-600 group-hover:text-white',
    bar: 'from-emerald-500 to-teal-500',
  },
  violet: {
    label: 'text-violet-200',
    iconBg: 'bg-violet-500/15 text-violet-100 ring-1 ring-violet-300/20',
    iconHover: 'group-hover:bg-violet-600 group-hover:text-white',
    bar: 'from-fuchsia-500 to-violet-500',
  },
  amber: {
    label: 'text-amber-200',
    iconBg: 'bg-amber-500/15 text-amber-100 ring-1 ring-amber-300/20',
    iconHover: 'group-hover:bg-orange-600 group-hover:text-white',
    bar: 'from-amber-500 to-orange-500',
  },
};

export default function MetricCard({
  label,
  value,
  help,
  tone = 'red',
  icon,
}: {
  label: string;
  value: string | number;
  help: string;
  tone?: Tone;
  icon?: React.ReactNode;
}) {
  const style = TONE_STYLES[tone];
  return (
    <article className="group relative overflow-hidden rounded-lg border border-white/12 bg-white/[0.07] p-3 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-white/[0.1]">
      <div className={`pointer-events-none absolute -right-8 -top-8 h-16 w-16 rounded-full bg-gradient-to-br ${style.bar} opacity-20 blur-xl transition group-hover:opacity-30`} />
      <div className="flex items-start justify-between gap-2">
        <p className={`text-[10px] font-black uppercase tracking-[0.12em] ${style.label}`}>{label}</p>
        <span className={`rounded-lg p-1.5 transition ${style.iconBg} ${style.iconHover}`}>
          {icon ?? <Activity className="h-3 w-3" />}
        </span>
      </div>
      <strong className="relative mt-1.5 block text-xl font-black text-white">{value}</strong>
      <p className="relative mt-1 text-xs font-medium text-slate-300">{help}</p>
      <div className="relative mt-2.5 h-1 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${style.bar}`} />
      </div>
    </article>
  );
}