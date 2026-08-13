import { Bar, BarChart, CartesianGrid, Cell, Label, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HistoricalRow } from '@/features/dashboard/analytics/services/historicalAnalyticsService';
import HistoricalChartCard from '@/features/dashboard/analytics/components/HistoricalChartCard';
import { ChartTooltip, axis, grid, labelStyle, margin } from '@/features/dashboard/analytics/components/HistoricalRechartBase';
import { calendarRows, fmt, peakRow } from '@/features/dashboard/analytics/components/historicalChartData';

export default function HistoricalMonthChart({ rows }: { rows: HistoricalRow[] }) {
  const data = calendarRows(rows);
  const high = peakRow(data);
  const low = data.reduce((best, row) => row.count < best.count ? row : best, data[0]);
  return (
    <HistoricalChartCard title="Earthquakes by Month" subtitle="January through December, grouped across all selected years." insight={`The busiest month is ${high?.fullLabel ?? 'not available'} with ${fmt(high?.count ?? 0)} earthquakes.`}>
      <div className="rounded-xl border border-white/10 bg-white/[0.035] p-2.5 shadow-inner shadow-cyan-950/20 backdrop-blur-lg">
        <div className="h-[360px] max-sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={margin}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="label" interval={0} {...axis}><Label value="Month" position="insideBottom" offset={-28} style={labelStyle} /></XAxis>
              <YAxis allowDecimals={false} tickFormatter={fmt} {...axis}><Label value="Number of earthquakes" angle={-90} position="insideLeft" style={labelStyle} /></YAxis>
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Earthquakes" barSize={14} radius={[7, 7, 0, 0]}>
                <LabelList dataKey="count" position="top" formatter={(value: number) => value > 0 && value === high?.count ? fmt(value) : ''} className="fill-white text-xs font-black" />
                {data.map((row) => <Cell key={row.label} fill={row.month === high?.month ? '#ef4444' : '#fb923c'} opacity={row.month === high?.month ? 1 : 0.82} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <SeasonalSummary high={high} low={low} />
    </HistoricalChartCard>
  );
}

function SeasonalSummary({ high, low }: { high: ReturnType<typeof calendarRows>[number] | null; low: ReturnType<typeof calendarRows>[number] }) {
  const diff = (high?.count ?? 0) - low.count;
  return (
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      <Insight label="Most active month" value={`${high?.fullLabel ?? 'Not available'} • ${fmt(high?.count ?? 0)} earthquakes`} />
      <Insight label="Least active month" value={`${low.fullLabel} • ${fmt(low.count)} earthquakes`} />
      <Insight label="Difference" value={`${fmt(diff)} earthquakes`} />
    </div>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4"><p className="font-sans text-xs font-black text-slate-400">{label}</p><p className="mt-1 font-sans text-base font-black text-white">{value}</p></div>;
}
