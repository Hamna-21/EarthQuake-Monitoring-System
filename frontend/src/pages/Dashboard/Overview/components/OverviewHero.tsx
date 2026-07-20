import { Activity, Radio } from 'lucide-react';

export default function OverviewHero() {
  return (
    <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 text-white shadow-2xl">
      {/* ambient color blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
          </span>
          Overview
        </p>

        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur">
          <Radio className="h-3 w-3 text-cyan-300" />
          Live
        </div>
      </div>

      <h1 className="relative mt-3 font-serif text-2xl font-black tracking-tight sm:text-3xl">
        The ground is talking
        <span className="bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
          {' '}& we&rsquo;re listening.
        </span>
      </h1>

      <p className="relative mt-2 max-w-xl text-sm font-light leading-snug text-slate-300">
        Real-time global seismic activity, risk signals, and alerts in one view.
      </p>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        <span className="flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold text-cyan-200">
          <Activity className="h-3 w-3" />
          Real-time
        </span>
        <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-bold text-violet-200">
          Global
        </span>
        <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[10px] font-bold text-red-200">
          Alert-ready
        </span>
      </div>
    </section>
  );
}