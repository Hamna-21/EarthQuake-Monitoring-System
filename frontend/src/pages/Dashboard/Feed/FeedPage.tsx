import { useEffect, useMemo, useState } from 'react';
import { DashboardProps, defaultFilters, EventFilters, SortState } from '../../../components/dashboard/types';
import { countryOf, csvFor, filterEvents, sortEvents } from '../../../components/dashboard/data';
import { RefreshNote } from '../../../components/dashboard/Shell';
import LiveFeedCard from './components/LiveFeedCard';
import LiveStatusBar from './components/LiveStatusBar';
import LiveTimeline from './components/LiveTimeline';
import FeedHeader from './components/FeedHeader';
import FeedFilters from './components/FeedFilters';

export default function FeedPage({ earthquakes, isLoading, dataError, lastUpdated, setSelectedId, openPage, globalSearch = '', highlightedEventId }: DashboardProps) {
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const [sort, setSort] = useState<SortState>({ key: 'time', direction: 'desc' });
  const [countryFilter, setCountryFilter] = useState('all');

  const byCountry = useMemo(() => (countryFilter === 'all' ? earthquakes : earthquakes.filter((e) => countryOf(e.place) === countryFilter)), [earthquakes, countryFilter]);
  const events = useMemo(() => sortEvents(filterEvents(byCountry, filters), sort), [byCountry, filters, sort]);

  const update = (patch: Partial<EventFilters>) => setFilters((c) => ({ ...c, ...patch }));
  useEffect(() => setFilters((c) => ({ ...c, query: globalSearch })), [globalSearch]);

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