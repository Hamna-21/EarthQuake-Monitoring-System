import { Bar, BarChart, CartesianGrid, Cell, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HistoricalRow } from '@/features/dashboard/analytics/services/historicalAnalyticsService';
import HistoricalChartCard from '@/features/dashboard/analytics/components/HistoricalChartCard';
import { ChartTooltip, axis, grid, labelStyle } from '@/features/dashboard/analytics/components/HistoricalRechartBase';
import { fmt, orderedRows, peakRow } from '@/features/dashboard/analytics/components/historicalChartData';

const magLabels = ['Below 4.0', '4.0-4.9', '5.0-5.9', '6.0-6.9', '7.0-7.9', '8.0+'];
const depthLabels = ['0-10 km', '10-30 km', '30-70 km', '70-150 km', '150-300 km', '300+ km'];
const magColors = ['#38bdf8', '#22d3ee', '#facc15', '#fb923c', '#ef4444', '#991b1b'];
const depthColors = ['#86efac', '#4ade80', '#22c55e', '#14b8a6', '#0ea5e9', '#6366f1'];
const chartMargin = { top: 18, right: 28, left: 42, bottom: 42 };

export default function HistoricalDistributionCharts({ magnitudeRows, depthRows }: { magnitudeRows: HistoricalRow[]; depthRows: HistoricalRow[] }) {
  const mags = orderedRows(magnitudeRows, magLabels);
  const depths = orderedRows(depthRows, depthLabels);
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <Distribution title="Magnitude Distribution" subtitle="Earthquakes grouped by strength range." insight={`${fmt(mags.reduce((sum, row) => sum + row.count, 0))} records include valid magnitude values.`} data={mags} colors={magColors} yTitle="Magnitude range" />
      <Distribution title="Depth Distribution" subtitle="Earthquakes grouped from shallow to deep." insight={`${fmt(depths.reduce((sum, row) => sum + row.count, 0))} records include valid depth values.`} data={depths} colors={depthColors} yTitle="Depth range" />
    </section>
  );
}

function Distribution({ title, subtitle, insight, data, colors, yTitle }: { title: string; subtitle: string; insight: string; data: Array<{ label: string; count: number }>; colors: string[]; yTitle: string }) {
  const peak = peakRow(data);
  return (
    <HistoricalChartCard title={title} subtitle={subtitle} insight={insight}>
      <div className="h-[360px] max-sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={chartMargin}>
            <CartesianGrid {...grid} />
            <XAxis type="number" allowDecimals={false} tickFormatter={fmt} {...axis}><Label value="Number of earthquakes" position="insideBottom" offset={-28} style={labelStyle} /></XAxis>
            <YAxis type="category" dataKey="label" width={86} interval={0} {...axis}><Label value={yTitle} angle={-90} position="insideLeft" style={labelStyle} /></YAxis>
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" name="Earthquakes" radius={[0, 8, 8, 0]} minPointSize={3}>
              {data.map((row, index) => <Cell key={row.label} fill={row === peak ? '#ef4444' : colors[index]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </HistoricalChartCard>
  );
}
