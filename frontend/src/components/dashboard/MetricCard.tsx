import React from 'react';
import { Activity } from 'lucide-react';

type Tone = 'red' | 'cyan' | 'emerald' | 'violet' | 'amber';

const TONE_STYLES: Record<Tone, { label: string; iconBg: string; iconHover: string; bar: string }> = {
  red: {
    label: 'text-red-600',
    iconBg: 'bg-red-50 text-red-700',
    iconHover: 'group-hover:bg-red-700 group-hover:text-white',
    bar: 'from-red-600 to-orange-400',
  },
  cyan: {
    label: 'text-cyan-600',
    iconBg: 'bg-cyan-50 text-cyan-700',
    iconHover: 'group-hover:bg-cyan-600 group-hover:text-white',
    bar: 'from-cyan-500 to-blue-500',
  },
  emerald: {
    label: 'text-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-700',
    iconHover: 'group-hover:bg-emerald-600 group-hover:text-white',
    bar: 'from-emerald-500 to-teal-500',
  },
  violet: {
    label: 'text-violet-600',
    iconBg: 'bg-violet-50 text-violet-700',
    iconHover: 'group-hover:bg-violet-600 group-hover:text-white',
    bar: 'from-fuchsia-500 to-violet-500',
  },
  amber: {
    label: 'text-orange-600',
    iconBg: 'bg-amber-50 text-orange-700',
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
    <article className="group rounded-2xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <p className={`text-xs font-black uppercase tracking-[0.16em] ${style.label}`}>{label}</p>
        <span className={`rounded-xl p-2 transition ${style.iconBg} ${style.iconHover}`}>
          {icon ?? <Activity className="h-4 w-4" />}
        </span>
      </div>
      <strong className="mt-4 block text-3xl font-black text-slate-950">{value}</strong>
      <p className="mt-2 text-sm font-medium text-slate-500">{help}</p>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${style.bar}`} />
      </div>
    </article>
  );
}