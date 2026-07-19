import { Earthquake } from '../../../../types';
import { countryOf } from '../../../../components/dashboard/data';

export default function ActiveRegions({ earthquakes }: { earthquakes: Earthquake[] }) {
  const regions = [...earthquakes.reduce((map, event) => {
    const country = countryOf(event.place);
    map.set(country, (map.get(country) || 0) + 1);
    return map;
  }, new Map<string, number>()).entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
      <h2 className="text-2xl font-black text-slate-950">Most Active Regions</h2>
      <div className="mt-5 grid gap-3">
        {regions.map(([country, count]) => (
          <article key={country} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <strong className="text-slate-950">{country}</strong>
              <span className="text-sm font-black text-red-700">{count} earthquakes</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-600" style={{ width: `${Math.min(100, count * 12)}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
