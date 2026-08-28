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
      className="magnitude-card"
    >
      <div
        className="magnitude-card__glow"
        style={{ background: dominantColor }}
      />

      <div className="magnitude-card__header">
        <div>
          <p className="magnitude-card__eyebrow">Seismic Analysis</p>
          <h3>Magnitude Distribution</h3>
        </div>
        <div className="magnitude-card__total-block">
          <span className="magnitude-card__total">{total}</span>
          <span>events</span>
        </div>
      </div>

      <div className="magnitude-card__bar">
        {buckets.map(([label, , , , color], i) => {
          const width = total > 0 ? Math.max(counts[i] > 0 ? 3 : 0, (counts[i] / total) * 100) : 100 / buckets.length;
          return width > 0 ? (
            <div
              key={label}
              className="magnitude-card__bar-segment"
              style={{ width: `${width}%`, backgroundColor: color, opacity: total > 0 ? undefined : 0.15, boxShadow: `0 0 8px ${color}80` }}
            />
          ) : null;
        })}
      </div>

      {total > 0 ? (
        <div className="magnitude-card__rows">
          {buckets.map(([label, , , severity, color], i) => {
            const count = counts[i];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const isDominant = i === dominant && count > 0;

            return (
              <div
                key={label}
                className="magnitude-card__row"
                style={{
                  backgroundColor: `${color}${isDominant ? '22' : '0d'}`,
                  borderColor: `${color}${isDominant ? '55' : '20'}`,
                }}
              >
                <span
                  className="magnitude-card__dot"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                />
                <span className="magnitude-card__label">M{label}</span>
                <span className="magnitude-card__severity" style={{ color }}>{severity}</span>
                <span className="magnitude-card__count">{count}</span>
                <span className="magnitude-card__percent" style={{ color }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="magnitude-card__empty">No seismic events recorded in this window.</p>
      )}
    </section>
  );
}
/** Visualizes the current earthquake count across magnitude bands. */
