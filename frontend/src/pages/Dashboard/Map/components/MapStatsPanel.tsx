import { Earthquake } from '../../../../types';
import { countryOf, statsFor } from '../../../../components/dashboard/data';

export default function MapStatsPanel({ events }: { events: Earthquake[] }) {
  const stats = statsFor(events);
  const topCountry = topActiveCountry(events);

  return (
    <aside className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 text-white shadow-2xl backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Live Intelligence</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="Live Earthquakes" value={events.length} />
        <Stat label="Largest" value={stats.strongest.toFixed(1)} />
        <Stat label="Average" value={stats.avgMag.toFixed(1)} />
        <Stat label="Today" value={stats.today} />
        <Stat label="Deepest" value={`${stats.maxDepth.toFixed(0)} km`} />
        <Stat label="Most Active" value={topCountry} />
      </div>
    </aside>
  );
}

function topActiveCountry(events: Earthquake[]) {
  const counts = new Map<string, number>();
  events.forEach((event) => counts.set(countryOf(event.place), (counts.get(countryOf(event.place)) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <strong className="mt-1 block text-lg font-black">{value}</strong>
    </div>
  );
}
