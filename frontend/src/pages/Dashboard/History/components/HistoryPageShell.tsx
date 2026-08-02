import type { Earthquake } from '../../../../types';
import { statsFor } from '../../../../components/dashboard/data';
import { DashboardProps } from '../../../../components/dashboard/types';
import { useHistoricalSearch } from '../useHistoricalSearch';
import { HistoryFilters } from './HistoryFilters';
import HistoryMapSection from './HistoryMapSection';
import HistoryMetrics from './HistoryMetrics';
import HistoryPageHeader from './HistoryPageHeader';
import HistoryPagination from './HistoryPagination';
import HistoricalResultsTable from './HistoricalResultsTable';

type Props = DashboardProps & {
  scope: 'global' | 'pakistan';
  label: string;
  title: string;
  description: string;
  mapTitle: string;
  mapDescription: string;
  locationLocked?: boolean;
  locationValue?: string;
  metricLabels?: Partial<Record<'countries', string>>;
};

export default function HistoryPageShell(props: Props) {
  const history = useHistoricalSearch(props.scope, props.locationLocked ? '' : props.globalSearch ?? '');
  const { startDate, endDate, minMag, query, events, page, hasMore, loading, error } = history;
  const stats = statsFor(events);
  const strongest = events.length ? stats.strongest.toFixed(1) : '—';
  const select = (event: Earthquake) => {
    if (props.setSelectedEvent) props.setSelectedEvent(event);
    else props.setSelectedId(event.id);
    props.openPage('details');
  };

  return (
    <>
      <HistoryPageHeader label={props.label} title={props.title} description={props.description} />
      <HistoryFilters
        startDate={startDate}
        endDate={endDate}
        minMag={minMag}
        query={props.locationLocked ? props.locationValue ?? 'Pakistan' : query}
        loading={loading}
        error={error}
        locationLabel="Country or Region"
        locationLocked={props.locationLocked}
        onStartDateChange={history.setStartDate}
        onEndDateChange={history.setEndDate}
        onMinMagChange={history.setMinMag}
        onQueryChange={history.setQuery}
        onSearch={() => history.search(1)}
        onReset={history.reset}
      />
      <HistoryMetrics records={events.length} strongest={strongest} countries={stats.countries} tsunami={stats.tsunami} labels={props.metricLabels} />
      <HistoryMapSection title={props.mapTitle} description={props.mapDescription} events={events} selectedId={props.selectedEvent?.id ?? null} loading={loading} onSelect={select} />
      <HistoryPagination page={page} count={events.length} limit={50} hasMore={hasMore} loading={loading} onPage={history.search} />
      <HistoricalResultsTable events={events} loading={loading} onSelect={select} />
    </>
  );
}
