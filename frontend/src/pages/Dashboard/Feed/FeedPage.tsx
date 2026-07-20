import { useMemo, useState } from 'react';
import { Download, Search, SlidersHorizontal } from 'lucide-react';
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
      <div className="relative overflow-hidden rounded-lg bg-slate-950 p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            Live Feed
          </p>
        </div>
        <h1 className="relative mt-3 font-serif text-3xl font-black italic tracking-tight text-white sm:text-4xl">
          Every tremor, as it happens.
        </h1>
        <p className="relative mt-2 max-w-xl text-sm font-light leading-relaxed text-slate-300">
          Scan, filter, and export global seismic activity the moment it's detected.
        </p>
      </div>

      <RefreshNote isLoading={isLoading} error={dataError} />
      <LiveStatusBar count={events.length} isLoading={isLoading} error={dataError} />
      <Filters filters={filters} sort={sort} onFilter={update} onSort={setSort} onExport={exportCsv} disabled={!events.length} />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="grid gap-4">
          {events.length > 0 ? (
            events.slice(0, 10).map((event) => (
              <LiveFeedCard key={event.id} event={event} onDetails={(selected) => select(selected.id)} />
            ))
          ) : (
            <div className="rounded-3xl border border-white/70 bg-white/85 p-8 text-center shadow-sm backdrop-blur">
              <p className="text-sm font-semibold text-slate-400">No events match your current filters.</p>
            </div>
          )}
        </section>
        <LiveTimeline events={events} />
      </div>

    </section>
  );
}

function Filters({ filters, sort, onFilter, onSort, onExport, disabled }: {
  filters: EventFilters; sort: SortState; onFilter: (patch: Partial<EventFilters>) => void;
  onSort: (sort: SortState) => void; onExport: () => void; disabled: boolean;
}) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
  <div className="grid items-end gap-4 lg:grid-cols-[1fr_170px_160px_150px_130px]">

    <div className="flex flex-col">
      <label className="mb-2 h-5 text-xs font-semibold text-slate-700">
        Search
      </label>
      <label className="relative">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
        <input
          value={filters.query}
          onChange={(e) => onFilter({ query: e.target.value })}
          placeholder="Search country, city, ID"
          className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-red-500"
        />
      </label>
    </div>

    <div className="flex flex-col">
      <label className="mb-2 h-5 text-xs font-semibold text-slate-700">
        Alert
      </label>
      <Select
        value={filters.alert}
        onChange={(value) => onFilter({ alert: value })}
        options={['all', 'green', 'yellow', 'orange', 'red', 'none']}
      />
    </div>

    <div className="flex flex-col">
      <label className="mb-2 h-5 text-xs font-semibold text-slate-700">
        Tsunami
      </label>
      <Select
        value={filters.tsunami}
        onChange={(value) => onFilter({ tsunami: value })}
        options={['all', 'yes', 'no']}
      />
    </div>

    <div className="flex flex-col">
      <label className="mb-2 h-5 text-xs font-semibold text-slate-700">
        Sort By
      </label>
      <Select
        value={sort.key}
        onChange={(value) => onSort({ ...sort, key: value as SortState['key'] })}
        options={['time', 'magnitude', 'depth', 'place']}
      />
    </div>

    <div className="flex flex-col">
      <label className="mb-2 h-5 text-xs font-semibold text-slate-700">
        Export
      </label>
      <button
        onClick={onExport}
        disabled={disabled}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-40"
      >
        <Download className="h-4 w-4" />
        CSV
      </button>
    </div>

  </div>
</section>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-slate-200 px-3 py-3 text-sm font-bold capitalize text-slate-700">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}