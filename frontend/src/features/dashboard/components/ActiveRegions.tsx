import { memo, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Earthquake } from '@/types';
import { countryOf } from '@/features/dashboard/utils/data';

const colors = ['#22d3ee', '#818cf8', '#fb923c', '#f43f5e', '#4ade80'];

const Dot = (props: any) => {
  const { cx, cy, index } = props;
  return <circle cx={cx} cy={cy} r={4} fill={colors[index % colors.length]} stroke="#0f172a" strokeWidth={1.5} />;
};

/** Renders or coordinates active regions for this frontend module. */
function ActiveRegions({ earthquakes }: { earthquakes: Earthquake[] }) {
  const regions = useMemo(() => [...earthquakes.reduce((map, event) => {
    const country = countryOf(event.place); map.set(country, (map.get(country) || 0) + 1); return map;
  }, new Map<string, number>()).entries()].sort((a, b) => b[1] - a[1]).slice(0, 5), [earthquakes]);
  const total = earthquakes.length;
  const chartData = useMemo(() => regions.map(([country, count], index) => ({ country, count, share: total ? Math.round((count / total) * 100) : 0, fill: colors[index] })), [regions, total]);

  return <section className="active-regions">
    <div className="active-regions__header">
      <div>
        <p className="active-regions__eyebrow">Seismic Analysis</p>
        <h2>Most Active Regions</h2>
      </div>
      <span className="active-regions__badge">{total} events</span>
    </div>
    {regions.length ? <>
      <div className="active-regions__chart">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="70%">
            <PolarGrid stroke="rgba(148,163,184,.28)" />
            <PolarAngleAxis dataKey="country" tick={{ fill: '#e2e8f0', fontSize: 9, fontWeight: 700 }} />
            <Radar name="Share" dataKey="share" stroke="#818cf8" fill="#818cf8" fillOpacity={0.28} strokeWidth={2} dot={<Dot />} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(103,232,249,.35)', borderRadius: 10, fontSize: 11 }} labelStyle={{ color: '#fff' }} formatter={(value: number, _name, item: any) => [`${value}% / ${item.payload.count} events`, item.payload.country]} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="active-regions__list">
        {chartData.map((item) => (
          <div key={item.country} className="active-regions__item">
            <span className="active-regions__dot" style={{ backgroundColor: item.fill }} />
            <MapPin className="active-regions__pin" />
            <span className="active-regions__country">{item.country}</span>
            <span className="active-regions__share" style={{ backgroundColor: `${item.fill}26`, color: item.fill }}>{item.share}%</span>
          </div>
        ))}
      </div>
    </> : <p className="active-regions__empty">No regional activity to report.</p>}
  </section>;
}

export default memo(ActiveRegions);
/** Summarizes the regions contributing the most current earthquake activity. */
