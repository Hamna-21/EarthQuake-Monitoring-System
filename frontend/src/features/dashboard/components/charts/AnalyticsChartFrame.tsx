import React from 'react';

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
    <section className={`geo-chart-card group p-3.5 ${wide ? 'xl:col-span-2' : ''}`}>
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative mb-2.5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-base font-black tracking-tight text-white">{title}</h3>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{subtitle}</p>
        </div>
        <span className="group/info relative grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 text-xs font-black text-cyan-100" aria-label={info} tabIndex={0}>
          i
          <span className="pointer-events-none absolute right-0 top-10 z-20 hidden w-56 rounded-xl border border-white/10 bg-slate-950 p-3 text-left text-xs font-semibold text-slate-300 shadow-2xl group-hover/info:block group-focus/info:block">
            {info}
          </span>
        </span>
      </div>
      <div className="relative mb-2.5 rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-2.5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">Key Takeaway</p>
        <p className="mt-1 text-xs font-black leading-relaxed text-white">{takeaway}</p>
      </div>
      <div className="relative">{children}</div>
      <p className="relative mt-2.5 rounded-xl bg-black/20 p-2.5 text-[11px] font-semibold leading-relaxed text-slate-300">
        {insight}
      </p>
    </section>
  );
}
