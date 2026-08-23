import { useEffect, useMemo } from 'react';
import { DashboardProps, defaultFilters, EventFilters, SortState } from '@/features/dashboard/types';
import { countryOf, csvFor, filterEvents, sortEvents } from '@/features/dashboard/utils/data';
import { RefreshNote } from '@/layouts/DashboardLayout';
import LiveFeedCard from '@/features/dashboard/components/LiveFeedCard';
import LiveStatusBar from '@/features/dashboard/components/LiveStatusBar';
import LiveTimeline from '@/features/dashboard/components/LiveTimeline';
import FeedHeader from '@/features/dashboard/components/FeedHeader';
import FeedFilters from '@/features/dashboard/components/FeedFilters';
import { useDashboardPageState } from '@/features/dashboard/hooks/DashboardStateContext';

/** Filters and sorts live events, then keeps cards, timeline, status, and CSV export in sync. */
export default function FeedPage({ earthquakes, isLoading, dataError, lastUpdated, setSelectedId, openPage, globalSearch = '', highlightedEventId }: DashboardProps) {
  const [filters, setFilters] = useDashboardPageState<EventFilters>('feed-filters', defaultFilters, true);
  const [sort, setSort] = useDashboardPageState<SortState>('feed-sort', { key: 'time', direction: 'desc' }, true);
  const [countryFilter, setCountryFilter] = useDashboardPageState('feed-country', 'all', true);

  const byCountry = useMemo(() => (countryFilter === 'all' ? earthquakes : earthquakes.filter((e) => countryOf(e.place) === countryFilter)), [earthquakes, countryFilter]);
  const events = useMemo(() => sortEvents(filterEvents(byCountry, filters), sort), [byCountry, filters, sort]);

  const update = (patch: Partial<EventFilters>) => setFilters((c) => ({ ...c, ...patch }));
  // Propagate the dashboard-wide search into the feed filter without replacing other feed selections.
  useEffect(() => { if (globalSearch) setFilters((c) => ({ ...c, query: globalSearch })); }, [globalSearch, setFilters]);

  const select = (id: string) => { setSelectedId(id); openPage('details'); };
  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([csvFor(events)], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: url, download: 'geopulse-live-feed.csv' }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-4">
      <FeedHeader />
      <RefreshNote isLoading={isLoading} error={dataError} lastUpdated={lastUpdated} />
      <LiveStatusBar count={events.length} isLoading={isLoading} error={dataError} />
      <FeedFilters filters={filters} sort={sort} onFilter={update} onSort={setSort} onExport={exportCsv} disabled={!events.length} />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.length ? (
          events.slice(0, 16).map((e) => <LiveFeedCard key={e.id} event={e} highlighted={e.id === highlightedEventId} onDetails={(sel) => select(sel.id)} />)
        ) : (
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-5 text-center sm:col-span-2 lg:col-span-3 xl:col-span-4">
            <p className="text-sm text-slate-400">No events match your current filters.</p>
          </div>
        )}
      </section>

      <LiveTimeline events={events} />
    </section>
  );
}
