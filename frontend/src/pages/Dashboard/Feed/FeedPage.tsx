import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { DashboardProps, defaultFilters, EventFilters, SortState } from '../../../components/dashboard/types';
import { csvFor, filterEvents, sortEvents } from '../../../components/dashboard/data';
import { DataTable } from '../../../components/dashboard/ui';
import { RefreshNote } from '../../../components/dashboard/Shell';
import LiveFeedCard from './components/LiveFeedCard';
import LiveStatusBar from './components/LiveStatusBar';
import LiveTimeline from './components/LiveTimeline';

export default function FeedPage({ earthquakes, isLoading, dataError, setSelectedId, openPage }: DashboardProps) {
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const [sort, setSort] = useState<SortState>({ key: 'time', direction: 'desc' });
  const events = useMemo(() => sortEvents(filterEvents(earthquakes, filters), sort), [earthquakes, filters, sort]);
  const update = (patch: Partial<EventFilters>) => setFilters((current) => ({ ...current, ...patch }));
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
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 p-8 text-white shadow-2xl">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.32em] text-red-200">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" /> Live
        </p>
        <h1 className="mt-4 text-5xl font-black">Real-Time Earthquake Monitoring</h1>
        <p className="mt-4 max-w-2xl text-red-100">A modern live feed for rapid scanning, filtering, export, and response decisions.</p>
      </div>
      <RefreshNote isLoading={isLoading} error={dataError} />
      <LiveStatusBar count={events.length} isLoading={isLoading} error={dataError} />
      <Filters filters={filters} sort={sort} onFilter={update} onSort={setSort} onExport={exportCsv} disabled={!events.length} />
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="grid gap-4">
          {events.slice(0, 10).map((event) => (
            <LiveFeedCard key={event.id} event={event} onDetails={(selected) => select(selected.id)} />
          ))}
        </section>
        <LiveTimeline events={events} />
      </div>
      <DataTable events={events} onSelect={(event) => select(event.id)} />
    </section>
  );
}

function Filters({ filters, sort, onFilter, onSort, onExport, disabled }: {
  filters: EventFilters; sort: SortState; onFilter: (patch: Partial<EventFilters>) => void;
  onSort: (sort: SortState) => void; onExport: () => void; disabled: boolean;
}) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
      <div className="grid gap-3 lg:grid-cols-[1fr_150px_150px_150px_120px]">
        <label className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input value={filters.query} onChange={(e) => onFilter({ query: e.target.value })} placeholder="Search country, city, id" className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-red-500" />
        </label>
        <Select value={filters.alert} onChange={(value) => onFilter({ alert: value })} options={['all', 'green', 'yellow', 'orange', 'red', 'none']} />
        <Select value={filters.tsunami} onChange={(value) => onFilter({ tsunami: value })} options={['all', 'yes', 'no']} />
        <Select value={sort.key} onChange={(value) => onSort({ ...sort, key: value as SortState['key'] })} options={['time', 'magnitude', 'depth', 'place']} />
        <button onClick={onExport} disabled={disabled} className="flex items-center justify-center gap-2 rounded-2xl bg-red-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"><Download className="h-4 w-4" /> CSV</button>
      </div>
    </section>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>;
}
