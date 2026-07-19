import { Earthquake } from '../../../../types';

const buckets = [
  ['0-2', 0, 2, 'from-blue-500 to-blue-400'],
  ['2-4', 2, 4, 'from-green-500 to-emerald-400'],
  ['4-5', 4, 5, 'from-yellow-400 to-amber-300'],
  ['5-6', 5, 6, 'from-orange-500 to-orange-400'],
  ['6-7', 6, 7, 'from-red-600 to-red-500'],
  ['7+', 7, 10, 'from-red-950 to-red-700'],
] as const;

export default function MagnitudeDistribution({ earthquakes }: { earthquakes: Earthquake[] }) {
  const maxCount = Math.max(1, ...buckets.map(([, min, max]) => earthquakes.filter((e) => e.magnitude >= min && e.magnitude < max).length));

  return (
    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Seismic Analysis</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Magnitude Distribution</h2>
      <div className="mt-6 space-y-4">
        {buckets.map(([label, min, max, gradient]) => {
          const count = earthquakes.filter((event) => event.magnitude >= min && event.magnitude < max).length;
          return (
            <div key={label}>
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-600">Magnitude {label}</span>
                <span className="text-slate-950">{count}</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all`} style={{ width: `${(count / maxCount) * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
