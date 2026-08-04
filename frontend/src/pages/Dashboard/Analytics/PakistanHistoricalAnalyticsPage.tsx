import { useEffect, useState } from 'react';
import type { DashboardProps } from '../../../components/dashboard/types';
import { createDefaultAnalyticsFilters, type AnalyticsFilters } from './analyticsTypes';
import AnalyticsRouteNav from './AnalyticsRouteNav';
import HistoricalAnalyticsControls from './components/HistoricalAnalyticsControls';
import HistoricalDistributionCharts from './components/HistoricalDistributionCharts';
import HistoricalFilterSummary from './components/HistoricalFilterSummary';
import HistoricalHeatmap from './components/HistoricalHeatmap';
import HistoricalMonthChart from './components/HistoricalMonthChart';
import HistoricalSummaryCards from './components/HistoricalSummaryCards';
import HistoricalTimelineChart from './components/HistoricalTimelineChart';
import HistoricalYearlyChart from './components/HistoricalYearlyChart';
import { useHistoricalAnalytics } from './useHistoricalAnalytics';

export default function PakistanHistoricalAnalyticsPage({ openPage }: DashboardProps) {
  const { filters, updateFilters, reset, data, error, isLoading, refresh } = useHistoricalAnalytics(true);
  const [draft, setDraft] = useState<AnalyticsFilters>(filters);
  useEffect(() => setDraft(filters), [filters]);
  const setDraftPatch = (patch: Partial<AnalyticsFilters>) => setDraft((current) => ({ ...current, ...patch }));
  const resetAll = () => { const defaults = createDefaultAnalyticsFilters(); setDraft(defaults); reset(); };
  return (
    <div className="space-y-6">
      <Header />
      <AnalyticsRouteNav active="analytics_pakistan" openPage={openPage} />
      <HistoricalAnalyticsControls draft={draft} setDraft={setDraftPatch} onApply={() => updateFilters(draft)} onReset={resetAll} onRefresh={refresh} isLoading={isLoading} />
      {isLoading && !data ? <Skeleton /> : null}
      {error ? <State title="Pakistan historical analytics could not load." text={error} action={refresh} /> : null}
      {data && <><p className="font-sans text-xs font-bold text-slate-400">Last generated: {new Date(data.metadata.generatedAt).toLocaleString()}</p>
        <HistoricalFilterSummary filters={filters} data={data} />
        <HistoricalSummaryCards data={data} />
        {data.summary.totalEvents === 0 ? <State title="No matching results found." text="Try a wider date range or lower minimum magnitude." action={resetAll} /> : <>
          <HistoricalYearlyChart rows={data.yearlyFrequency} />
          <HistoricalMonthChart rows={data.calendarMonthFrequency} />
          <HistoricalDistributionCharts magnitudeRows={data.magnitudeDistribution} depthRows={data.depthDistribution} />
          <HistoricalHeatmap rows={data.yearMonthHeatmap} />
          <HistoricalTimelineChart data={data} />
        </>}
      </>}
    </div>
  );
}

function Header() {
  return <div className="rounded-2xl border border-orange-300/15 bg-slate-950/70 p-5 shadow-2xl"><h1 className="font-serif text-3xl font-black text-white">Pakistan Historical Analytics</h1><p className="mt-2 font-sans text-sm font-semibold text-slate-300">Pakistan-area seismic patterns from 1975 to present</p><p className="mt-3 inline-flex rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 font-sans text-xs font-bold text-orange-50">Results use stored Pakistan-area records and the selected filters.</p></div>;
}

function Skeleton() {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-white/10" />)}</div>;
}

function State({ title, text, action }: { title: string; text: string; action: () => void }) {
  return <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-8 text-center shadow-2xl"><h3 className="font-sans text-xl font-black text-white">{title}</h3><p className="mt-2 font-sans text-sm font-semibold text-slate-400">{text}</p><button onClick={action} className="mt-4 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 px-5 py-3 font-sans text-xs font-black uppercase tracking-wider text-white">Retry</button></div>;
}
