import { Activity, AlertTriangle, Gauge, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import type { DashboardProps } from '../../../components/dashboard/types';
import { countryOf, fmtDate, significant, statsFor } from '../../../components/dashboard/data';
import { DepthChart, MagnitudeDepthChart, TimelineChart } from '../../../components/dashboard/Charts';
import AnalyticsStatCard from './AnalyticsStatCard';

type LiveAnalyticsProps = Pick<DashboardProps, 'earthquakes' | 'globalSearch'>;

export default function LiveAnalyticsPage(props: DashboardProps) {
  return <LiveAnalyticsContent {...props} />;
}

export function LiveAnalyticsContent({ earthquakes, globalSearch = '' }: LiveAnalyticsProps) {
  const q = globalSearch.trim().toLowerCase();
  const events = q ? earthquakes.filter((event) => `${event.place} ${countryOf(event.place)} ${event.id} ${event.magnitude} ${event.alert ?? ''} ${event.status} ${fmtDate(event.time, 'UTC')}`.toLowerCase().includes(q)) : earthquakes;
  const stats = statsFor(events);
  const major = significant(events).filter((event) => event.magnitude >= 5).length;
  const cards = [
    [<Gauge className="h-4 w-4" />, 'Average Strength', stats.avgMag.toFixed(2), 'Typical strength', 'from-cyan-400 via-sky-500 to-blue-600', 'shadow-cyan-900/40'],
    [<AlertTriangle className="h-4 w-4" />, 'Stronger Earthquakes', String(major), 'Reports needing attention', 'from-amber-400 via-orange-500 to-rose-500', 'shadow-orange-900/40'],
    [<ShieldCheck className="h-4 w-4" />, 'Checked Reports', String(stats.reviewed), 'Reports marked reviewed', 'from-emerald-400 via-teal-500 to-cyan-500', 'shadow-emerald-900/40'],
    [<Layers className="h-4 w-4" />, 'Deepest Earthquake', `${stats.maxDepth.toFixed(0)} km`, 'Below the surface', 'from-violet-400 via-purple-500 to-fuchsia-600', 'shadow-purple-900/40'],
    [<Activity className="h-4 w-4" />, 'Highest Alerts', String(stats.red), 'Most serious alert records', 'from-rose-500 via-red-500 to-rose-700', 'shadow-rose-900/40'],
  ] as const;
  return <section className="border-t border-white/10 pt-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="flex items-center gap-2 font-serif text-[10px] font-black uppercase tracking-[0.24em] text-fuchsia-300"><Sparkles className="h-3.5 w-3.5" /> Live Seismic Analytics</p><h2 className="mt-1 font-serif text-xl font-black tracking-tight text-white">Live earthquake patterns</h2></div></div><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{cards.map(([icon, label, value, help, gradient, glow]) => <AnalyticsStatCard key={label} icon={icon} label={label} value={value} help={help} gradient={gradient} glow={glow} />)}</div><div className="mt-4 grid gap-4 xl:grid-cols-2"><TimelineChart events={events} /><DepthChart events={events} /><MagnitudeDepthChart events={events} /></div></section>;
}