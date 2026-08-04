import type { ReactNode } from 'react';

export default function HistoricalChartCard({
  title,
  subtitle,
  insight,
  children,
  className = '',
}: {
  title: string;
  subtitle: string;
  insight: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative overflow-hidden rounded-2xl border border-cyan-300/10 bg-slate-950/70 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_30%)]" />
      <div className="relative mb-4">
        <h3 className="font-sans text-xl font-black text-white">{title}</h3>
        <p className="mt-1 font-sans text-sm font-semibold text-slate-400">{subtitle}</p>
      </div>
      <div className="relative">{children}</div>
      <p className="relative mt-4 rounded-xl border border-orange-300/10 bg-slate-950/55 p-3 font-sans text-sm font-semibold text-slate-300">
        <span className="text-orange-200">What this shows: </span>{insight}
      </p>
    </section>
  );
}
