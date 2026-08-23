import type { AnalyticsFilters } from '@/features/dashboard/analytics/types';
import type { HistoricalAnalyticsResponse } from '@/features/dashboard/analytics/services/historicalAnalyticsService';

/** Renders or coordinates historical filter summary for this frontend module. */
export default function HistoricalFilterSummary({ filters, data }: { filters: AnalyticsFilters; data: HistoricalAnalyticsResponse }) {
  const items = [`Years: ${filters.startDate.slice(0, 4)} to ${filters.endDate.slice(0, 4)}`, `Magnitude: M${filters.minMagnitude}+`, `Location: ${filters.location || 'Worldwide'}`];
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
/** Summarizes the active filters applied to historical analytics results. */
