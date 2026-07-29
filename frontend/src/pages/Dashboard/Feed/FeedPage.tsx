import { useEffect, useMemo, useState } from 'react';
import { DashboardProps, defaultFilters, EventFilters, SortState } from '../../../components/dashboard/types';
import { csvFor, filterEvents, sortEvents } from '../../../components/dashboard/data';
import { RefreshNote } from '../../../components/dashboard/Shell';
import LiveFeedCard from './components/LiveFeedCard';
import LiveStatusBar from './components/LiveStatusBar';
import LiveTimeline from './components/LiveTimeline';
import FeedHeader from './components/FeedHeader';
import FeedFilters from './components/FeedFilters';

export default function FeedPage({ earthquakes, isLoading, dataError, setSelectedId, openPage, globalSearch = '', highlightedEventId }: DashboardProps) {
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const [sort, setSort] = useState<SortState>({ key: 'time', direction: 'desc' });
  const events = useMemo(() => sortEvents(filterEvents(earthquakes, filters), sort), [earthquakes, filters, sort]);
  const update = (patch: Partial<EventFilters>) => setFilters((current) => ({ ...current, ...patch }));
  useEffect(() => setFilters((current) => ({ ...current, query: globalSearch })), [globalSearch]);
  const select = (id: string) => {
    setSelectedId(id);
    openPage('details');
  };
  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([csvFor(events)], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: url, download: 'geopulse-live-feed.csv' }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <FeedHeader />
      <RefreshNote isLoading={isLoading} error={dataError} />
      <LiveStatusBar count={events.length} isLoading={isLoading} error={dataError} />
      <FeedFilters filters={filters} sort={sort} onFilter={update} onSort={setSort} onExport={exportCsv} disabled={!events.length} />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="grid gap-4">
          {events.length > 0 ? events.slice(0, 10).map((event) => <LiveFeedCard key={event.id} event={event} highlighted={event.id === highlightedEventId} onDetails={(selected) => select(selected.id)} />) : <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-8 text-center shadow-sm backdrop-blur"><p className="text-sm font-semibold text-slate-400">No events match your current filters.</p></div>}
        </section>
        <LiveTimeline events={events} />
      </div>
    </section>
  );
}



