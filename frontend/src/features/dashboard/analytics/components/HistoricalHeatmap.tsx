import type { HistoricalRow } from '@/features/dashboard/analytics/services/historicalAnalyticsService';
import HistoricalChartCard from '@/features/dashboard/analytics/components/HistoricalChartCard';
import { fmt, monthFull, monthShort, peakRow } from '@/features/dashboard/analytics/components/historicalChartData';

const tone = (count: number, max: number) => {
  if (count === 0) return 'bg-slate-800/80';
  const ratio = count / Math.max(1, max);
  if (ratio < .25) return 'bg-amber-300/70';
  if (ratio < .55) return 'bg-orange-400/80';
  if (ratio < .85) return 'bg-orange-600';
  return 'bg-red-600';
};

export default function HistoricalHeatmap({ rows }: { rows: HistoricalRow[] }) {
  const years = [...new Set(rows.map((row) => row.year).filter(Boolean))] as number[];
  const max = Math.max(1, ...rows.map((row) => row.count));
  const peak = peakRow(rows.map((row) => ({ ...row, count: row.count })));
  const countFor = (year: number, month: number) => rows.find((row) => row.year === year && row.month === month)?.count ?? 0;
  return (
    <HistoricalChartCard title="Earthquake Activity Heatmap" subtitle="Rows are years and columns are months." insight={`The strongest cell is ${monthFull[(peak?.month ?? 1) - 1] ?? 'a month'} ${peak?.year ?? ''} with ${fmt(peak?.count ?? 0)} earthquakes.`}>
      <div className="overflow-x-auto">
        <div className="min-w-[620px] rounded-2xl bg-slate-950/45 p-4">
          <div className="grid grid-cols-[70px_repeat(12,1fr)] gap-1 font-sans text-xs font-black text-orange-100">
            <span>Year</span>{monthShort.map((month) => <span key={month} className="text-center">{month}</span>)}
          </div>
          <div className="mt-2 max-h-[430px] overflow-y-auto pr-1">
            {years.map((year, index) => <div key={year} className="grid grid-cols-[70px_repeat(12,1fr)] gap-1">
              <span className="py-1 font-sans text-xs font-black text-slate-200">{index % 2 === 0 ? year : ''}</span>
              {monthShort.map((month, monthIndex) => {
                const count = countFor(year, monthIndex + 1);
                return <span key={month} title={`${monthFull[monthIndex]} ${year}\nEarthquakes: ${fmt(count)}`} className={`h-6 rounded-md border border-white/10 ${tone(count, max)}`} />;
              })}
            </div>)}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 font-sans text-xs font-bold text-slate-200">
            {['No activity', 'Low', 'Moderate', 'High', 'Peak'].map((label, index) => <span key={label} className="flex items-center gap-1.5"><i className={`h-3 w-5 rounded ${['bg-slate-800', 'bg-amber-300', 'bg-orange-400', 'bg-orange-600', 'bg-red-600'][index]}`} />{label}</span>)}
          </div>
        </div>
      </div>
    </HistoricalChartCard>
  );
}
