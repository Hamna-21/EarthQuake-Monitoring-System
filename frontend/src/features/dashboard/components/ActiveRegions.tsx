import { MapPin } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Earthquake } from '@/types';
import { countryOf } from '@/features/dashboard/utils/data';

const colors = ['#22d3ee', '#818cf8', '#fb923c', '#f43f5e', '#4ade80'];

const Dot = (props: any) => {
  const { cx, cy, index } = props;
  return <circle cx={cx} cy={cy} r={4} fill={colors[index % colors.length]} stroke="#0f172a" strokeWidth={1.5} />;
};

export default function ActiveRegions({ earthquakes }: { earthquakes: Earthquake[] }) {
  const regions = [...earthquakes.reduce((map, event) => {
    const country = countryOf(event.place); map.set(country, (map.get(country) || 0) + 1); return map;
  }, new Map<string, number>()).entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = earthquakes.length;
  const chartData = regions.map(([country, count], index) => ({ country, count, share: total ? Math.round((count / total) * 100) : 0, fill: colors[index] }));

  return <section className="mt-8 rounded-xl border border-white/12 bg-white/[0.07] p-5 shadow-sm backdrop-blur">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-serif text-[9px] font-bold uppercase tracking-[0.25em] text-red-400">Seismic Analysis</p>
        <h2 className="mt-1 font-serif text-base font-black tracking-tight text-white">Most Active Regions</h2>
      </div>
      <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-black text-cyan-100">{total} events</span>
    </div>
    {regions.length ? <>
      <div className="mt-4 h-40 rounded-xl border border-cyan-300/15 bg-slate-950/55 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="70%">
            <PolarGrid stroke="rgba(148,163,184,.28)" />
            <PolarAngleAxis dataKey="country" tick={{ fill: '#e2e8f0', fontSize: 9, fontWeight: 700 }} />
            <Radar name="Share" dataKey="share" stroke="#818cf8" fill="#818cf8" fillOpacity={0.28} strokeWidth={2} dot={<Dot />} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(103,232,249,.35)', borderRadius: 10, fontSize: 11 }} labelStyle={{ color: '#fff' }} formatter={(value: number, _name, item: any) => [`${value}% / ${item.payload.count} events`, item.payload.country]} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {chartData.map((item) => (
          <div key={item.country} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.fill }} />
            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-white">{item.country}</span>
            <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black" style={{ backgroundColor: `${item.fill}26`, color: item.fill }}>{item.share}%</span>
          </div>
        ))}
      </div>
    </> : <p className="mt-4 text-center text-xs font-semibold text-slate-400">No regional activity to report.</p>}
  </section>;
}