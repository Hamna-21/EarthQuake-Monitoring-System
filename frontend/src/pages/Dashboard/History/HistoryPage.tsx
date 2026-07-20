import React, { useState } from 'react';
import { CalendarDays, Flame, Globe2, History, Search, TriangleAlert, Waves } from 'lucide-react';
import { Earthquake } from '../../../types';
import { fetchHistoricalEarthquakes } from '../../../utils/usgsApi';
import { DataTable, MetricCard } from '../../../components/dashboard/ui';
import MapCanvas from '../../../components/dashboard/MapCanvas';
import { statsFor } from '../../../components/dashboard/data';
import { DashboardProps } from '../../../components/dashboard/types';

export default function HistoryPage({
  selectedEvent,
  setSelectedId,
  setSelectedEvent,
  openPage,
}: DashboardProps) {
  const now = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState(now);
  const [minMag, setMinMag] = useState(5);
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stats = statsFor(events);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      setEvents(await fetchHistoricalEarthquakes({ startDate, endDate, minMagnitude: minMag, query }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Historical search failed');
    } finally {
      setLoading(false);
    }
  };

  const select = (event: Earthquake) => {
    if (setSelectedEvent) setSelectedEvent(event);
    else setSelectedId(event.id);
    openPage('details');
  };

  return (
    <>
      {/* Colorful hero header, consistent with Analytics/Map pages */}
      <div className="relative mb-6 overflow-hidden rounded-lg border border-rose-500/20 bg-slate-950 px-6 py-6 shadow-2xl sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-red-400/10 blur-3xl" />

        <div className="relative">
          <p className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.28em] text-rose-300">
            <History className="h-3.5 w-3.5" /> Historical Earthquake Records
          </p>
          <h1 className="mt-2 bg-gradient-to-r from-rose-300 via-orange-300 to-amber-200 bg-clip-text font-serif text-2xl font-black italic tracking-tight text-transparent sm:text-3xl">
            Dig through decades of seismic history.
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-400">
            Search official records from 1990 onward. Filter by country, date range, and magnitude, then trace every match on the interactive map.
          </p>
        </div>
      </div>

      {/* Filter panel */}
      <section className="mb-6 overflow-hidden rounded-3xl border border-rose-100 bg-white p-5 shadow-md shadow-slate-200/60 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-rose-500 to-orange-500" />
          <h2 className="text-base font-black text-slate-800">Search Filters</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <Field label="Start date" type="date" value={startDate} setValue={setStartDate} icon={<CalendarDays className="h-3.5 w-3.5" />} />
          <Field label="End date" type="date" value={endDate} setValue={setEndDate} icon={<CalendarDays className="h-3.5 w-3.5" />} />
          <Field label="Min magnitude" type="number" value={String(minMag)} setValue={(v) => setMinMag(Number(v))} icon={<Flame className="h-3.5 w-3.5" />} />
          <Field label="Country or region" value={query} setValue={setQuery} icon={<Globe2 className="h-3.5 w-3.5" />} />

          <div className="flex flex-col justify-end">
            <button
              onClick={search}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-rose-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Spinner /> Searching
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" /> Search
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-200">
            <TriangleAlert className="h-4 w-4 flex-shrink-0" /> {error}
          </p>
        )}
      </section>

      {/* Metric strip — each MetricCard gets its own color tone */}
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Records Found"
          value={events.length}
          help="Returned by this historical query"
          tone="cyan"
          icon={<Search className="h-4 w-4" />}
        />
        <MetricCard
          label="Strongest"
          value={events.length ? stats.strongest.toFixed(1) : '—'}
          help="Maximum magnitude"
          tone="red"
          icon={<Flame className="h-4 w-4" />}
        />
        <MetricCard
          label="Countries"
          value={stats.countries}
          help="Extracted from locations"
          tone="emerald"
          icon={<Globe2 className="h-4 w-4" />}
        />
        <MetricCard
          label="Tsunami"
          value={stats.tsunami}
          help="Official tsunami flag"
          tone="violet"
          icon={<Waves className="h-4 w-4" />}
        />
      </section>

      {/* Map */}
      <section className="mb-6 overflow-hidden rounded-3xl border border-rose-500/20 shadow-2xl">
        <MapCanvas events={events} selectedId={selectedEvent?.id ?? null} onSelect={select} />
      </section>

      {/* DataTable already renders its own card, header, and empty state — no extra wrapper needed */}
      <DataTable events={events} onSelect={select} />
    </>
  );
}

function Field({
  label,
  value,
  setValue,
  type = 'text',
  icon,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-black uppercase tracking-wide text-slate-500">
      <span className="mb-1.5 flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <input
        type={type}
        value={value}
        min={type === 'date' ? '1990-01-01' : undefined}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition-colors focus:border-rose-400 focus:bg-white"
      />
    </label>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}