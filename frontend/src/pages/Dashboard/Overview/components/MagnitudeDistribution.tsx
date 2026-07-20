import { Earthquake } from '../../../../types';

const buckets = [
  ['0-2', 0, 2, 'Micro', 'bg-blue-500', 'text-blue-700', 'bg-blue-50', 'border-blue-200'],
  ['2-4', 2, 4, 'Minor', 'bg-emerald-500', 'text-emerald-700', 'bg-emerald-50', 'border-emerald-200'],
  ['4-5', 4, 5, 'Light', 'bg-amber-400', 'text-amber-700', 'bg-amber-50', 'border-amber-200'],
  ['5-6', 5, 6, 'Moderate', 'bg-orange-500', 'text-orange-700', 'bg-orange-50', 'border-orange-200'],
  ['6-7', 6, 7, 'Strong', 'bg-red-600', 'text-red-700', 'bg-red-50', 'border-red-200'],
  ['7+', 7, 10, 'Major', 'bg-red-950', 'text-red-900', 'bg-red-100', 'border-red-300'],
] as const;

export default function MagnitudeDistribution({ earthquakes }: { earthquakes: Earthquake[] }) {
  const counts = buckets.map(([, min, max]) => earthquakes.filter((e) => e.magnitude >= min && e.magnitude < max).length);
  const total = earthquakes.length;
  const dominant = counts.indexOf(Math.max(...counts));

  return (
    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-700">Seismic Analysis</p>
          <h2 className="mt-1.5 font-serif text-2xl font-black italic tracking-tight text-slate-950">
            Magnitude Distribution
          </h2>
        </div>
        <div className="text-right">
          <p className="font-serif text-3xl font-black leading-none text-slate-950">{total}</p>
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">total events</p>
        </div>
      </div>

      {/* unified scale strip — one continuous gauge instead of six separate bars */}
      <div className="mt-6 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        {buckets.map(([label, , , , bar], i) => {
          const width = total > 0 ? Math.max(counts[i] > 0 ? 3 : 0, (counts[i] / total) * 100) : 100 / buckets.length;
          return width > 0 ? (
            <div
              key={label}
              className={`h-full ${bar} transition-all duration-700 ease-out ${i > 0 ? 'ml-[1px]' : ''}`}
              style={{ width: `${width}%`, opacity: total > 0 ? undefined : 0.15 }}
            />
          ) : null;
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] font-semibold text-slate-400">
        <span>M0</span>
        <span>M10+</span>
      </div>

      {/* ranked breakdown */}
      <div className="mt-6 space-y-1.5">
        {buckets.map(([label, , , severity, bar, text, tint, border], i) => {
          const count = counts[i];
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isDominant = i === dominant && count > 0;

          return (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-colors ${
                isDominant ? `${tint} ${border}` : 'border-transparent hover:bg-slate-50'
              }`}
            >
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${bar}`} />

              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-sm font-black text-slate-950">M {label}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${text}`}>{severity}</span>
                  {isDominant && (
                    <span className="rounded-full bg-slate-950 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      Most common
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-sm font-bold text-slate-950">{count}</span>
                {total > 0 && <span className="ml-1 font-mono text-[10px] text-slate-400">{pct}%</span>}
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <p className="mt-6 text-center text-sm font-semibold text-slate-400">No seismic events recorded in this window.</p>
      )}
    </section>
  );
}