import type { Earthquake } from '@/types';
import { DashboardProps } from '@/features/dashboard/types';
import { useHistoricalSearch } from '@/features/dashboard/historical/hooks/useHistoricalSearch';
import { HistoryFilters } from '@/features/dashboard/historical/components/HistoryFilters';
import HistoryMapSection from '@/features/dashboard/historical/components/HistoryMapSection';
import HistoryPageHeader from '@/features/dashboard/historical/components/HistoryPageHeader';
import HistoryPagination from '@/features/dashboard/historical/components/HistoryPagination';
import HistoricalResultsTable from '@/features/dashboard/historical/components/HistoricalResultsTable';
import { usePlaceFocus } from '@/features/dashboard/map/hooks/usePlaceFocus';

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
  const { startDate, endDate, minMag, query, searchedQuery, events, page, hasMore, loading, error } = history;
  const focusQuery = props.locationLocked ? props.locationValue ?? 'Pakistan' : searchedQuery;
  const { place: focusPlace } = usePlaceFocus(focusQuery);
  const select = (event: Earthquake) => {
    if (props.setSelectedEvent) props.setSelectedEvent(event);
    else props.setSelectedId(event.id);
  };
  const openDetails = (event: Earthquake) => {
    select(event);
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
      <HistoryMapSection title={props.mapTitle} description={props.mapDescription} events={events} loading={loading} onSelect={select} onDetails={openDetails} focusLocation={focusPlace} />
      <HistoryPagination page={page} count={events.length} limit={50} hasMore={hasMore} loading={loading} onPage={history.search} />
      <HistoricalResultsTable events={events} loading={loading} onSelect={openDetails} />
    </>
  );
}
