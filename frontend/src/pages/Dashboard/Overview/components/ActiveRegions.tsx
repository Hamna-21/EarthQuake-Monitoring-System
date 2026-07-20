import { MapPin } from 'lucide-react';
import { Earthquake } from '../../../../types';
import { countryOf } from '../../../../components/dashboard/data';

const rankStyles = [
  { badge: 'bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950', bar: 'from-amber-400 to-orange-500', tint: 'bg-amber-50/60 border-amber-200/70' },
  { badge: 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800', bar: 'from-orange-400 to-red-500', tint: 'border-transparent' },
  { badge: 'bg-gradient-to-br from-orange-300 to-orange-400 text-orange-950', bar: 'from-orange-400 to-red-600', tint: 'border-transparent' },
  { badge: 'bg-slate-200 text-slate-600', bar: 'from-red-400 to-red-600', tint: 'border-transparent' },
] as const;

export default function ActiveRegions({ earthquakes }: { earthquakes: Earthquake[] }) {
  const regions = [...earthquakes.reduce((map, event) => {
    const country = countryOf(event.place);
    map.set(country, (map.get(country) || 0) + 1);
    return map;
  }, new Map<string, number>()).entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);

  const maxCount = Math.max(1, ...regions.map(([, count]) => count));
  const total = earthquakes.length;

  return (
    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-700">Seismic Analysis</p>
          <h2 className="mt-1.5 font-serif text-2xl font-black italic tracking-tight text-slate-950">
            Most Active Regions
          </h2>
        </div>
        {regions.length > 0 && (
          <div className="text-right">
            <p className="font-serif text-2xl font-black leading-none text-slate-950">{regions.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">tracked</p>
          </div>
        )}
      </div>

      {regions.length > 0 ? (
        <div className="mt-6 space-y-2">
          {regions.map(([country, count], i) => {
            const style = rankStyles[i] ?? rankStyles[3];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isLeader = i === 0;

            return (
              <article
                key={country}
                className={`group rounded-2xl border p-4 transition-colors ${
                  isLeader ? style.tint : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-xs font-black ${style.badge}`}>
                    {i + 1}
                  </span>

                  <div className="flex flex-1 items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <strong className="font-serif text-base font-black text-slate-950">{country}</strong>
                      {isLeader && (
                        <span className="ml-1 rounded-full bg-slate-950 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-white">
                          Leading
                        </span>
                      )}
                    </div>
                    <span className="flex items-baseline gap-1 font-mono">
                      <span className="text-sm font-black text-red-700">{count}</span>
                      {total > 0 && <span className="text-[10px] font-semibold text-slate-400">{pct}%</span>}
                    </span>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/70">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${style.bar} shadow-sm transition-all duration-700 ease-out`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-center text-sm font-semibold text-slate-400">No regional activity to report.</p>
      )}
    </section>
  );
}