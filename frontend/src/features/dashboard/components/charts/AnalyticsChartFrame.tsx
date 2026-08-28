import React from 'react';

/** Renders or coordinates analytics chart frame for this frontend module. */
export default function AnalyticsChartFrame({
  title,
  subtitle,
  takeaway,
  insight,
  info,
  children,
  wide = false,
}: {
  title: string;
  subtitle: string;
  takeaway: string;
  insight: string;
  info: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section className={`geo-chart-card analytics-chart-frame ${wide ? 'analytics-chart-frame--wide' : ''}`}>
      <div className="analytics-chart-frame__glow" />
      <div className="analytics-chart-frame__header">
        <div>
          <h3 className="font-serif text-base font-black tracking-tight text-white">{title}</h3>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{subtitle}</p>
        </div>
        <span className="analytics-chart-frame__info" aria-label={info} tabIndex={0}>
          i
          <span className="analytics-chart-frame__tooltip">
            {info}
          </span>
        </span>
      </div>
      <div className="analytics-chart-frame__takeaway">
        <p className="analytics-chart-frame__takeaway-label">Key Takeaway</p>
        <p className="analytics-chart-frame__takeaway-text">{takeaway}</p>
      </div>
      <div className="relative">{children}</div>
      <p className="analytics-chart-frame__insight">
        {insight}
      </p>
    </section>
  );
}
/** Wraps dashboard charts with consistent glass styling and sizing. */
