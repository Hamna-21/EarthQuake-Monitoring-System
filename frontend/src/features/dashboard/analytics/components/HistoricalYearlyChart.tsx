import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, Label, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HistoricalRow } from '@/features/dashboard/analytics/services/historicalAnalyticsService';
import HistoricalChartCard from '@/features/dashboard/analytics/components/HistoricalChartCard';
import { ChartTooltip, axis, grid, labelStyle, margin } from '@/features/dashboard/analytics/components/HistoricalRechartBase';
import { fmt, peakRow, tickYears } from '@/features/dashboard/analytics/components/historicalChartData';

/** Shows yearly historical counts with a highlighted peak and optional expanded chart view. */
export default function HistoricalYearlyChart({ rows }: { rows: HistoricalRow[] }) {
  const data = rows.map((row) => ({ year: row.year, count: row.count }));
  const peak = peakRow(data);
  const ticks = tickYears(rows, 10);
  const [open, setOpen] = useState(false);
  return (
    <HistoricalChartCard title="Earthquake Frequency by Year" subtitle="Earthquake counts from the current global historical filters." insight={`The highest activity occurred in ${peak?.year ?? 'the selected range'} with ${fmt(peak?.count ?? 0)} earthquakes.`}>
      <button type="button" onClick={() => setOpen((value) => !value)} className="w-full rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 px-3 py-2.5 text-left text-xs font-black uppercase tracking-[0.12em] text-white shadow-lg shadow-orange-950/20 transition hover:brightness-110">
        Explore Yearly Frequency {open ? '▲' : '▼'}
      </button>
      {open && <div className="mt-3 h-[360px] max-sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={margin}>
            <defs><linearGradient id="yearFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#fb923c" stopOpacity={0.55} /><stop offset="1" stopColor="#fb923c" stopOpacity={0.04} /></linearGradient></defs>
            <CartesianGrid {...grid} />
            <XAxis dataKey="year" ticks={ticks} interval={0} {...axis}><Label value="Year" position="insideBottom" offset={-28} style={labelStyle} /></XAxis>
            <YAxis allowDecimals={false} domain={[0, 'dataMax']} tickFormatter={fmt} {...axis}><Label value="Number of earthquakes" angle={-90} position="insideLeft" style={labelStyle} /></YAxis>
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="count" name="Earthquakes" stroke="#fb923c" strokeWidth={3} fill="url(#yearFill)" dot={false} activeDot={{ r: 6, fill: '#ef4444' }} />
            {peak && <ReferenceDot x={peak.year} y={peak.count} r={7} fill="#ef4444" stroke="#fff" strokeWidth={2} />}
          </AreaChart>
        </ResponsiveContainer>
      </div>}
    </HistoricalChartCard>
  );
}
