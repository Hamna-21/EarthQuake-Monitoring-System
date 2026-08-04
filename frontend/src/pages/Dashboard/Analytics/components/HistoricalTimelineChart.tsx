import { useState } from 'react';
import { CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HistoricalAnalyticsResponse } from '../historicalAnalyticsApi';
import { ChartTooltip, axis, grid, labelStyle, margin } from './HistoricalRechartBase';
import { fmt, monthFull, monthShort, monthlyLabels, peakRow } from './historicalChartData';

export default function HistoricalTimelineChart({ data }: { data: HistoricalAnalyticsResponse }) {
  const [open, setOpen] = useState(false);
  const rows = data.monthlyTimeline.map((row) => ({ ...row, label: `${monthShort[(row.month ?? 1) - 1]} ${row.year}` }));
  const peak = peakRow(rows);
  const ticks = monthlyLabels(rows, 10);
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl">
      <button onClick={() => setOpen((value) => !value)} className="w-full rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 px-4 py-3 text-left font-sans text-sm font-black uppercase tracking-[0.12em] text-white">
        Explore Detailed Monthly Timeline {open ? '▲' : '▼'}
      </button>
      {open && <div className="mt-4 h-[360px] max-sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={margin}>
            <CartesianGrid {...grid} />
            <XAxis dataKey="label" ticks={ticks} interval={0} {...axis}><Label value="Month and year" position="insideBottom" offset={-28} style={labelStyle} /></XAxis>
            <YAxis allowDecimals={false} tickFormatter={fmt} {...axis}><Label value="Number of earthquakes" angle={-90} position="insideLeft" style={labelStyle} /></YAxis>
            <Tooltip content={<ChartTooltip />} labelFormatter={(_, payload) => {
              const row = payload?.[0]?.payload;
              return `${monthFull[(row?.month ?? 1) - 1] ?? 'Month'} ${row?.year ?? ''}`;
            }} />
            <Line type="monotone" dataKey="count" name="Earthquakes" stroke="#fb923c" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: '#ef4444' }} />
            {peak && <text x="50%" y="22" textAnchor="middle" className="fill-white text-xs font-black">Peak month: {fmt(peak.count)}</text>}
          </LineChart>
        </ResponsiveContainer>
      </div>}
    </section>
  );
}
