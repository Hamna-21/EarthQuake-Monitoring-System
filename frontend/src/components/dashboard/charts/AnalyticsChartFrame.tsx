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
    <section className={`group relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.07] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-300/25 ${wide ? 'xl:col-span-2' : ''}`}>
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-serif text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Quick view</p>
          <h3 className="mt-1 font-serif text-xl font-black tracking-tight text-white">{title}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-400">{subtitle}</p>
        </div>
        <span className="group/info relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/10 text-sm font-black text-cyan-100" aria-label={info} tabIndex={0}>
          i
          <span className="pointer-events-none absolute right-0 top-10 z-20 hidden w-56 rounded-xl border border-white/10 bg-slate-950 p-3 text-left text-xs font-semibold text-slate-300 shadow-2xl group-hover/info:block group-focus/info:block">
            {info}
          </span>
        </span>
      </div>
      <div className="relative mb-5 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">Key Takeaway</p>
        <p className="mt-1 text-sm font-black leading-relaxed text-white">{takeaway}</p>
      </div>
      <div className="relative">{children}</div>
      <p className="relative mt-4 rounded-2xl bg-black/20 p-4 text-sm font-semibold leading-relaxed text-slate-300">
        {insight}
      </p>
    </section>
  );
}
