import React from 'react';
import { Activity } from 'lucide-react';

export default function MetricCard({
  label,
  value,
  help,
}: {
  label: string;
  value: string | number;
  help: string;
}) {
  return (
    <article className="group rounded-2xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-red-600">{label}</p>
        <span className="rounded-xl bg-red-50 p-2 text-red-700 transition group-hover:bg-red-700 group-hover:text-white">
          <Activity className="h-4 w-4" />
        </span>
      </div>
      <strong className="mt-4 block text-3xl font-black text-slate-950">{value}</strong>
      <p className="mt-2 text-sm font-medium text-slate-500">{help}</p>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-red-600 to-orange-400" />
      </div>
    </article>
  );
}
