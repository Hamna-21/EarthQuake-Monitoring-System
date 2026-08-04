import type { AnalyticsFilters } from '../analyticsTypes';
import type { HistoricalAnalyticsResponse } from '../historicalAnalyticsApi';

const value = (item: number | null, suffix = '') => item === null ? 'Any' : `${item}${suffix}`;

export default function HistoricalFilterSummary({ filters, data }: { filters: AnalyticsFilters; data: HistoricalAnalyticsResponse }) {
  const items = [
    `Dates: ${filters.startDate} to ${filters.endDate}`,
    `Magnitude: ${filters.minMagnitude} to ${value(filters.maxMagnitude)}`,
    `Depth: ${value(filters.minDepth, ' km')} to ${value(filters.maxDepth, ' km')}`,
    `Study region: Pakistan area`,
  ];
  return (
    <section className="rounded-2xl border border-orange-300/15 bg-slate-950/55 p-4 shadow-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-sans text-base font-black text-white">{data.summary.totalEvents.toLocaleString()} earthquakes shown</h2>
          <p className="mt-1 font-sans text-xs font-semibold text-slate-400">Cards and charts use the same filtered historical dataset.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 font-sans text-xs font-bold text-slate-200">{item}</span>)}
        </div>
      </div>
    </section>
  );
}
