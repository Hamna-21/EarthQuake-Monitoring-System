import React from 'react';
import { Activity, AlertTriangle, Gauge, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { DashboardProps } from '../../../components/dashboard/types';
import { statsFor, significant } from '../../../components/dashboard/data';
import { CountryChart, DepthChart, MagnitudeChart, TimelineChart } from '../../../components/dashboard/Charts';
import { RefreshNote } from '../../../components/dashboard/Shell';

export default function AnalyticsPage({ earthquakes, isLoading, dataError }: DashboardProps) {
  const stats = statsFor(earthquakes);
  const major = significant(earthquakes).filter((e) => e.magnitude >= 5).length;

  return (
    <>
      {/* Colorful hero header */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-slate-950 px-6 py-6 shadow-2xl sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative">
          <p className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-300">
            <Sparkles className="h-3.5 w-3.5" /> Analytics & Insights
          </p>
          <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 bg-clip-text font-serif text-2xl font-black italic tracking-tight text-transparent sm:text-3xl">
            Turn seismic noise into a story worth telling.
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-400">
            Every chart below is drawn live from the earthquake records currently loaded in GeoPulse — no cached snapshots, no guesswork.
          </p>
        </div>
      </div>

      <RefreshNote isLoading={isLoading} error={dataError} />

      {/* Metric strip */}
      <section className="mb-6 mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={<Gauge className="h-4 w-4" />}
          label="Average Magnitude"
          value={stats.avgMag.toFixed(2)}
          help="Mean value across current events"
          gradient="from-cyan-400 via-sky-500 to-blue-600"
          glow="shadow-cyan-900/40"
        />
        <StatCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Significant Events"
          value={String(major)}
          help="Magnitude 5+ or alert-worthy records"
          gradient="from-amber-400 via-orange-500 to-rose-500"
          glow="shadow-orange-900/40"
        />
        <StatCard
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Reviewed Events"
          value={String(stats.reviewed)}
          help="Status equals reviewed"
          gradient="from-emerald-400 via-teal-500 to-cyan-500"
          glow="shadow-emerald-900/40"
        />
        <StatCard
          icon={<Layers className="h-4 w-4" />}
          label="Max Depth"
          value={`${stats.maxDepth.toFixed(0)} km`}
          help="Deepest returned event"
          gradient="from-violet-400 via-purple-500 to-fuchsia-600"
          glow="shadow-purple-900/40"
        />
        <StatCard
          icon={<Activity className="h-4 w-4" />}
          label="Red Alerts"
          value={String(stats.red)}
          help="Critical alert level records"
          gradient="from-rose-500 via-red-500 to-rose-700"
          glow="shadow-rose-900/40"
        />
      </section>

      {/* Charts — each component renders its own full card now, no extra wrapper needed */}
      <section className="grid gap-6 xl:grid-cols-2">
        <MagnitudeChart events={earthquakes} />
        <DepthChart events={earthquakes} />
        <CountryChart events={earthquakes} />
        <TimelineChart events={earthquakes} />
      </section>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  help,
  gradient,
  glow,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  help: string;
  gradient: string;
  glow: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-4 shadow-xl transition-transform hover:-translate-y-0.5">
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-30`} />

      <div className="relative flex items-center gap-2">
        <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg ${glow}`}>
          {icon}
        </span>
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      </div>

      <p className={`relative mt-3 bg-gradient-to-r ${gradient} bg-clip-text font-serif text-3xl font-black italic tracking-tight text-transparent`}>
        {value}
      </p>
      <p className="relative mt-1 text-[11px] font-semibold text-slate-500">{help}</p>
    </div>
  );
}