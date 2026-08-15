import { useEffect, useMemo, useState } from 'react';
import type { Earthquake } from '@/types';
import type { DashboardProps } from '@/features/dashboard/types';
import InteractiveGlobePanel from '@/features/dashboard/map/components/InteractiveGlobePanel';
import { GlobeLegend } from '@/features/dashboard/map/components/InteractiveGlobePanel';
import GlobeViewControls from '@/features/dashboard/map/components/GlobeViewControls';
import type { View } from '@/features/dashboard/map/components/globeData';
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
import { usePlaceFocus } from '@/features/dashboard/map/hooks/usePlaceFocus';
import PageTitle from '@/features/dashboard/components/common/PageTitle';

type Props = DashboardProps;
export default function GlobalHistoricalAnalyticsPage(props: DashboardProps) { return <HistoricalAnalyticsPanel {...props} />; }

export function HistoricalAnalyticsPanel(props: Props) {
  const { filters, applyFilters, reset, data, error, isLoading } = useHistoricalAnalytics();
  const [draft, setDraft] = useState<AnalyticsFilters>(filters);
  const [view, setView] = useState<View>('night');
  useEffect(() => setDraft(filters), [filters]);
  const events = useMemo(() => data ? mapHistoricalEvents(data.mapEvents) : [], [data]);
  const { place: focusPlace } = usePlaceFocus(filters.location);
  const select = (event: Earthquake) => props.setSelectedEvent ? props.setSelectedEvent(event) : props.setSelectedId(event.id);
  const details = (event: Earthquake) => { select(event); props.openPage('details'); };
  const resetAll = () => { const defaults = createDefaultAnalyticsFilters('global'); setDraft(defaults); reset(); };
  const name = 'Global Historical Analytics';
  const mapTitle = 'Global Historical Earthquake Map';
  return <div className="space-y-4"><PageTitle eyebrow="Historical earthquake data" title={name} subtitle="Choose filters, then search the historical earthquake data." /><HistoricalAnalyticsControls draft={draft} setDraft={(patch) => setDraft((current) => ({ ...current, ...patch }))} onApply={() => applyFilters(draft)} onReset={resetAll} isLoading={isLoading} showLocation />
    {isLoading && !data ? <State title="Loading historical earthquakes..." text="Fetching historical earthquake data." /> : null}{error ? <State title="Historical analytics could not load." text={error} action={() => applyFilters(filters)} /> : null}{!data && !isLoading && !error ? <State title="Ready to search" text="Set a year range and minimum magnitude, then select Search." /> : null}
    {data && <><HistoricalFilterSummary filters={filters} data={data} /><HistoricalSummaryCards data={data} /><section className="space-y-2"><div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-serif text-lg font-black text-white">{mapTitle}</h2><p className="text-sm font-medium text-slate-300">Interactive historical earthquake activity with the same filtered dataset as the analytics.</p></div><GlobeViewControls view={view} onChange={setView} /></div><InteractiveGlobePanel events={events} onSelect={select} onDetails={details} autoRotate={false} focusLocation={focusPlace} focusLabel={focusPlace?.label} popupMode="historical" compact bare view={view} onViewChange={setView} legendOutside /><GlobeLegend outside /></section>
      {data.summary.totalEvents ? <><HistoricalMonthChart rows={data.calendarMonthFrequency} /><HistoricalDistributionCharts magnitudeRows={data.magnitudeDistribution} depthRows={data.depthDistribution} /><HistoricalHeatmap rows={data.yearMonthHeatmap} /><HistoricalTimelineChart data={data} /><HistoricalYearlyChart rows={data.yearlyFrequency} /></> : <State title="No matching earthquakes found." text="Try a longer period or lower minimum magnitude." action={resetAll} />}</>}
  </div>;
}

function State({ title, text, action }: { title: string; text: string; action?: () => void }) { return <div className="historical-analytics-state"><h2 className="font-serif text-xl font-black text-white">{title}</h2><p className="mt-2 text-sm font-semibold text-slate-400">{text}</p>{action && <button onClick={action} className="mt-4 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 px-4 py-2 text-xs font-black text-white">Reset filters</button>}</div>; }
