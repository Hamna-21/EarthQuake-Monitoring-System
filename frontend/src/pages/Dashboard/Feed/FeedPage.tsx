import React, { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { DashboardProps, defaultFilters, EventFilters, SortState } from '../../../components/dashboard/types';
import { csvFor, filterEvents, sortEvents } from '../../../components/dashboard/data';
import { DataTable, EventList } from '../../../components/dashboard/ui';
import { PageTitle, RefreshNote } from '../../../components/dashboard/Shell';

export default function FeedPage({ earthquakes, isLoading, dataError, setSelectedId, openPage }: DashboardProps) {
  const [filters, setFilters] = useState<EventFilters>(defaultFilters);
  const [sort, setSort] = useState<SortState>({ key: 'time', direction: 'desc' });
  const events = useMemo(() => sortEvents(filterEvents(earthquakes, filters), sort), [earthquakes, filters, sort]);
  const select = (id: string) => { setSelectedId(id); openPage('details'); };
  const update = (patch: Partial<EventFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([csvFor(events)], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: url, download: 'geopulse-live-feed.csv' }).click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <section className="relative overflow-hidden rounded-none bg-gradient-to-r from-[#3b0a0a] via-[#6b1111] to-[#8b1e1e] px-10 py-12 text-white shadow-xl">

  {/* Background Glow */}
  <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-500/20 blur-3xl"></div>
  <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl"></div>

  {/* Grid Pattern */}
  <div className="absolute inset-0 opacity-10">
    <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
  </div>

  <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

    <div className="max-w-3xl">

      <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-red-200">
        LIVE EARTHQUAKE MONITORING
      </p>

      <h1 className="text-5xl font-black leading-tight">
        Global Seismic Activity Feed
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-red-100">
        inspect detailed geological information through the GeoPulse monitoring
        platform.
      </p>

    </div>


  </div>
</section>
      <RefreshNote isLoading={isLoading} error={dataError} />
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_160px_160px_160px_120px]">
          <label className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input value={filters.query} onChange={(e) => update({ query: e.target.value })} placeholder="Search location " className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-red-500" />
          </label>
          <select value={filters.alert} onChange={(e) => update({ alert: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="all">All alerts</option><option value="green">Green</option><option value="yellow">Yellow</option><option value="orange">Orange</option><option value="red">Red</option><option value="none">None</option></select>
          <select value={filters.tsunami} onChange={(e) => update({ tsunami: e.target.value })} className="rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="all">Tsunami all</option><option value="yes">Tsunami yes</option><option value="no">Tsunami no</option></select>
          <select value={sort.key} onChange={(e) => setSort({ ...sort, key: e.target.value as SortState['key'] })} className="rounded-xl border border-slate-200 px-3 py-3 text-sm"><option value="time">Newest</option><option value="magnitude">Magnitude</option><option value="depth">Depth</option><option value="place">Location</option></select>
          <button onClick={exportCsv} disabled={!events.length} className="flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"><Download className="h-4 w-4" /> CSV</button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <Range label="Min mag" value={filters.minMag} setValue={(v) => update({ minMag: v })} max={10} />
          <Range label="Max mag" value={filters.maxMag} setValue={(v) => update({ maxMag: v })} max={10} />
          <Range label="Min depth" value={filters.minDepth} setValue={(v) => update({ minDepth: v })} max={700} />
          <Range label="Max depth" value={filters.maxDepth} setValue={(v) => update({ maxDepth: v })} max={700} />
        </div>
      </section>
      <section className="mb-6"><h3 className="mb-3 text-xl font-black text-slate-950">Detailed Event Cards</h3><EventList events={events.slice(0, 8)} onSelect={(e) => select(e.id)} /></section>
      <DataTable events={events} onSelect={(e) => select(e.id)} />
    </>
  );
}

function Range({ label, value, setValue, max }: { label: string; value: number; setValue: (v: number) => void; max: number }) {
  return <label className="rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-500">{label}<input type="range" min="0" max={max} step={max === 10 ? 0.1 : 1} value={value} onChange={(e) => setValue(Number(e.target.value))} className="mt-2 block w-full accent-red-700" /><span className="text-base font-black text-slate-950">{value}</span></label>;
}
