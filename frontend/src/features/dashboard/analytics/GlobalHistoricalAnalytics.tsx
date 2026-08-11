import { useEffect, useMemo, useState } from 'react';
import type { Earthquake } from '@/types';
import type { DashboardProps } from '@/features/dashboard/types';
import HistoryMapSection from '@/features/dashboard/historical/components/HistoryMapSection';
import { createDefaultAnalyticsFilters, type AnalyticsFilters } from '@/features/dashboard/analytics/types';
import HistoricalAnalyticsControls from '@/features/dashboard/analytics/components/HistoricalAnalyticsControls';
import HistoricalDistributionCharts from '@/features/dashboard/analytics/components/HistoricalDistributionCharts';
import HistoricalFilterSummary from '@/features/dashboard/analytics/components/HistoricalFilterSummary';
import HistoricalHeatmap from '@/features/dashboard/analytics/components/HistoricalHeatmap';
import HistoricalMonthChart from '@/features/dashboard/analytics/components/HistoricalMonthChart';
import HistoricalSummaryCards from '@/features/dashboard/analytics/components/HistoricalSummaryCards';
import HistoricalTimelineChart from '@/features/dashboard/analytics/components/HistoricalTimelineChart';
import HistoricalYearlyChart from '@/features/dashboard/analytics/components/HistoricalYearlyChart';
import { mapHistoricalEvents } from '@/features/dashboard/analytics/services/historicalAnalyticsService';
import { useHistoricalAnalytics } from '@/features/dashboard/analytics/hooks/useHistoricalAnalytics';

type Props = DashboardProps & { region?: AnalyticsFilters['region'] };
export default function GlobalHistoricalAnalyticsPage(props: DashboardProps) { return <HistoricalAnalyticsPanel {...props} region="global" />; }

export function HistoricalAnalyticsPanel(props: Props) {
  const region = props.region ?? 'global';
  const { filters, applyFilters, reset, data, error, isLoading } = useHistoricalAnalytics(region);
  const [draft, setDraft] = useState<AnalyticsFilters>(filters);
  useEffect(() => setDraft(filters), [filters]);
  const events = useMemo(() => data ? mapHistoricalEvents(data.mapEvents) : [], [data]);
  const select = (event: Earthquake) => props.setSelectedEvent ? props.setSelectedEvent(event) : props.setSelectedId(event.id);
  const details = (event: Earthquake) => { select(event); props.openPage('details'); };
  const resetAll = () => { const defaults = createDefaultAnalyticsFilters(region); setDraft(defaults); reset(); };
  const name = region === 'pakistan' ? 'Pakistan Historical Analytics' : 'Global Historical Analytics';
  const mapTitle = region === 'pakistan' ? 'Pakistan Historical Earthquake Map' : 'Global Historical Earthquake Map';
  return <div className="space-y-4"><header className="rounded-2xl border border-orange-300/15 bg-white/[0.07] p-4 shadow-sm backdrop-blur"><p className="font-serif text-[10px] font-black uppercase tracking-[0.24em] text-orange-200">USGS historical catalogue</p><h1 className="mt-1 font-serif text-2xl font-black text-white">{name}</h1><p className="mt-1 text-sm font-semibold text-slate-300">Choose filters, then search the USGS catalogue.</p></header><HistoricalAnalyticsControls draft={draft} setDraft={(patch) => setDraft((current) => ({ ...current, ...patch }))} onApply={() => applyFilters(draft)} onReset={resetAll} isLoading={isLoading} showLocation={region === 'global'} />
    {isLoading && !data ? <State title="Loading historical earthquakes..." text="Fetching the selected range from the USGS catalogue." /> : null}{error ? <State title="Historical analytics could not load." text={error} action={() => applyFilters(filters)} /> : null}{!data && !isLoading && !error ? <State title="Ready to search" text="Set a year range and minimum magnitude, then select Search." /> : null}
    {data && <><HistoricalFilterSummary filters={filters} data={data} /><HistoricalSummaryCards data={data} /><HistoryMapSection title={mapTitle} description="Markers, cards, and charts use the same current filters." events={events} selectedId={props.selectedEvent?.id ?? null} loading={isLoading} onSelect={select} onDetails={details} />
      {data.summary.totalEvents ? <><HistoricalYearlyChart rows={data.yearlyFrequency} /><HistoricalMonthChart rows={data.calendarMonthFrequency} /><HistoricalDistributionCharts magnitudeRows={data.magnitudeDistribution} depthRows={data.depthDistribution} /><HistoricalHeatmap rows={data.yearMonthHeatmap} /><HistoricalTimelineChart data={data} /></> : <State title="No matching earthquakes found." text="Try a longer period or lower minimum magnitude." action={resetAll} />}</>}
  </div>;
}

function State({ title, text, action }: { title: string; text: string; action?: () => void }) { return <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 text-center"><h2 className="font-serif text-xl font-black text-white">{title}</h2><p className="mt-2 text-sm font-semibold text-slate-400">{text}</p>{action && <button onClick={action} className="mt-4 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 px-4 py-2 text-xs font-black text-white">Reset filters</button>}</div>; }
