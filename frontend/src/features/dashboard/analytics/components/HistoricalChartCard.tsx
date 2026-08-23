import type { ReactNode } from 'react';

/** Renders or coordinates historical chart card for this frontend module. */
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
    <section className={`geo-historical-chart-card geo-dashboard-card relative overflow-hidden p-4 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_30%)]" />
      <div className="geo-chart-card-header relative mb-3">
        <h3 className="geo-chart-title font-serif text-lg font-black tracking-tight text-white">{title}</h3>
        <p className="geo-chart-subtitle mt-0.5 text-xs font-semibold text-slate-400">{subtitle}</p>
      </div>
      <div className="relative">{children}</div>
      <p className="relative mt-3 rounded-xl border border-orange-300/10 bg-slate-950/55 p-2.5 text-xs font-semibold leading-relaxed text-slate-300">
        <span className="text-orange-200">What this shows: </span>{insight}
      </p>
    </section>
  );
}
/** Provides a consistent glass frame and title area for historical charts. */
