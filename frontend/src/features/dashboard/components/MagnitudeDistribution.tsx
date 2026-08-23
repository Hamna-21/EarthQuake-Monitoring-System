import { useMemo } from 'react';
import { Earthquake } from '@/types';

const buckets = [
  ['0-2', 0, 2, 'Micro', '#38bdf8'],
  ['2-4', 2, 4, 'Minor', '#34d399'],
  ['4-5', 4, 5, 'Light', '#fbbf24'],
  ['5-6', 5, 6, 'Moderate', '#fb923c'],
  ['6-7', 6, 7, 'Strong', '#f87171'],
  ['7+', 7, 10, 'Major', '#f43f5e'],
] as const;

/** Renders or coordinates magnitude distribution for this frontend module. */
export default function MagnitudeDistribution({ earthquakes }: { earthquakes: Earthquake[] }) {
  const counts = useMemo(() => buckets.map(([, min, max]) => earthquakes.filter((e) => e.magnitude >= min && e.magnitude < max).length), [earthquakes]);
  const total = earthquakes.length;
  const dominant = counts.indexOf(Math.max(...counts));
  const dominantColor = buckets[dominant]?.[4] ?? '#38bdf8';

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full blur-3xl opacity-25"
        style={{ background: dominantColor }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="font-serif text-[10px] font-bold uppercase tracking-[0.17em] text-cyan-300">Seismic Analysis</p>
          <h3 className="mt-0.5 font-serif text-base font-bold text-white">Magnitude Distribution</h3>
        </div>
        <div className="text-right">
          <p className="font-serif text-lg font-black leading-none text-white">{total}</p>
          <p className="font-serif text-[10px] font-bold uppercase tracking-wide text-slate-500">events</p>
        </div>
      </div>

      <div className="relative mt-2.5 flex h-2 overflow-hidden rounded-full bg-white/10">
        {buckets.map(([label, , , , color], i) => {
          const width = total > 0 ? Math.max(counts[i] > 0 ? 3 : 0, (counts[i] / total) * 100) : 100 / buckets.length;
          return width > 0 ? (
            <div
              key={label}
              className={`h-full transition-all duration-700 ease-out ${i > 0 ? 'ml-px' : ''}`}
              style={{ width: `${width}%`, backgroundColor: color, opacity: total > 0 ? undefined : 0.15, boxShadow: `0 0 8px ${color}80` }}
            />
          ) : null;
        })}
      </div>

      {total > 0 ? (
        <div className="relative mt-2.5 space-y-1">
          {buckets.map(([label, , , severity, color], i) => {
            const count = counts[i];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isDominant = i === dominant && count > 0;

            return (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg border px-2 py-1.5 backdrop-blur-sm transition-colors"
                style={{
                  backgroundColor: `${color}${isDominant ? '22' : '0d'}`,
                  borderColor: `${color}${isDominant ? '55' : '20'}`,
                }}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                />
                <span className="font-serif text-[13px] font-black text-white">M{label}</span>
                <span className="font-serif text-[11px] font-bold" style={{ color }}>{severity}</span>
                <span className="ml-auto font-serif text-[13px] font-black text-white">{count}</span>
                <span className="w-9 text-right font-serif text-[11px] font-bold" style={{ color }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-center font-serif text-sm font-semibold text-slate-400">No seismic events recorded in this window.</p>
      )}
    </section>
  );
}
/** Visualizes the current earthquake count across magnitude bands. */
