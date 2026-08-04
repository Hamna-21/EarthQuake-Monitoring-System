import { Activity, AlertTriangle, Gauge, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { DashboardProps } from '../../../components/dashboard/types';
import { countryOf, fmtDate, statsFor, significant } from '../../../components/dashboard/data';
import { CountryChart, DepthChart, MagnitudeChart, MagnitudeDepthChart, TimelineChart } from '../../../components/dashboard/Charts';
import { RefreshNote } from '../../../components/dashboard/Shell';
import AnalyticsStatCard from './AnalyticsStatCard';
import AnalyticsRouteNav from './AnalyticsRouteNav';

export default function LiveAnalyticsPage({ earthquakes, isLoading, dataError, lastUpdated, globalSearch = '', openPage }: DashboardProps) {
  const q = globalSearch.trim().toLowerCase();
  const events = q ? earthquakes.filter((event) => `${event.place} ${countryOf(event.place)} ${event.id} ${event.magnitude} ${event.alert ?? ''} ${event.status} ${fmtDate(event.time, 'UTC')}`.toLowerCase().includes(q)) : earthquakes;
  const stats = statsFor(events);
  const major = significant(events).filter((event) => event.magnitude >= 5).length;
  return (
    <>
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-fuchsia-500/20 bg-slate-950 px-6 py-6 shadow-2xl sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative">
          <p className="flex items-center gap-2 font-serif text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-300"><Sparkles className="h-3.5 w-3.5" /> Analytics & Insights</p>
          <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 bg-clip-text font-serif text-2xl font-black tracking-tight text-transparent sm:text-3xl">Turn seismic noise into a story worth telling.</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-400">Every chart below is drawn live from the earthquake records currently loaded in GeoPulse.</p>
        </div>
      </div>
      <AnalyticsRouteNav active="analytics" openPage={openPage} />
      <RefreshNote isLoading={isLoading} error={dataError} lastUpdated={lastUpdated} />
      <section className="mb-6 mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <AnalyticsStatCard icon={<Gauge className="h-4 w-4" />} label="Average Strength" value={stats.avgMag.toFixed(2)} help="Typical strength of the loaded earthquakes" gradient="from-cyan-400 via-sky-500 to-blue-600" glow="shadow-cyan-900/40" />
        <AnalyticsStatCard icon={<AlertTriangle className="h-4 w-4" />} label="Stronger Earthquakes" value={String(major)} help="Reports that may need more attention" gradient="from-amber-400 via-orange-500 to-rose-500" glow="shadow-orange-900/40" />
        <AnalyticsStatCard icon={<ShieldCheck className="h-4 w-4" />} label="Checked Reports" value={String(stats.reviewed)} help="Reports marked as reviewed" gradient="from-emerald-400 via-teal-500 to-cyan-500" glow="shadow-emerald-900/40" />
        <AnalyticsStatCard icon={<Layers className="h-4 w-4" />} label="Deepest Earthquake" value={`${stats.maxDepth.toFixed(0)} km`} help="Farthest below the surface" gradient="from-violet-400 via-purple-500 to-fuchsia-600" glow="shadow-purple-900/40" />
        <AnalyticsStatCard icon={<Activity className="h-4 w-4" />} label="Highest Alerts" value={String(stats.red)} help="Most serious alert records" gradient="from-rose-500 via-red-500 to-rose-700" glow="shadow-rose-900/40" />
      </section>
      <div className="mb-4 mt-8"><p className="font-serif text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200">Realtime visual analysis</p><h2 className="mt-1 font-serif text-2xl font-black text-white">Live earthquake graphs</h2></div>
      <section className="grid gap-6 xl:grid-cols-2"><TimelineChart events={events} /><MagnitudeChart events={events} /><DepthChart events={events} /><CountryChart events={events} /><MagnitudeDepthChart events={events} /></section>
    </>
  );
}
