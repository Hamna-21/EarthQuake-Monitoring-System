import React, { useState } from 'react';
import { Earthquake } from '../../../types';
import { fetchHistoricalEarthquakes } from '../../../utils/usgsApi';
import { DataTable, MetricCard } from '../../../components/dashboard/ui';
import MapCanvas from '../../../components/dashboard/MapCanvas';
import { statsFor } from '../../../components/dashboard/data';
import { DashboardProps } from '../../../components/dashboard/types';
import { PageTitle } from '../../../components/dashboard/Shell';

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
     <section className="relative overflow-hidden border border-red-900/20 bg-gradient-to-r from-red-950 via-red-900 to-rose-800 px-10 py-8 text-white shadow-xl">

    <div className="absolute right-0 top-0 h-64 w-64 bg-red-500/10 blur-3xl"></div>

    <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200">
        HISTORICAL EARTHQUAKE DATABASE
    </p>

    <h1 className="mt-3 text-5xl font-black">
        Historical Earthquake Explorer
    </h1>

    <p className="mt-4 max-w-3xl text-red-100">
        Search official Earthquake records from 1990 onwards. Filter
        earthquakes by country, date range and magnitude while visualizing every
        event on an interactive world map.
    </p>

</section>
        <div className="mt-12 mb-12 grid gap-4 md:grid-cols-5">
          <Field label="Start date" type="date" value={startDate} setValue={setStartDate} />
          <Field label="End date" type="date" value={endDate} setValue={setEndDate} />
          <Field label="Min magnitude" type="number" value={String(minMag)} setValue={(v) => setMinMag(Number(v))} />
          <Field label="Country or region" value={query} setValue={setQuery} />
          <button onClick={search} disabled={loading} className="self-end rounded-xl bg-red-700 px-4 py-3 text-sm font-black text-white hover:bg-red-800 disabled:opacity-50">{loading ? 'Searching...' : 'Search'}</button>
        </div>
        {error && <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
     
      <section className="mt-12 mb-12 grid gap-12 md:grid-cols-4">
        <MetricCard label="Records Found" value={events.length} help="Returned by this historical query" />
        <MetricCard label="Strongest" value={` ${stats.strongest.toFixed(1)}`} help="Maximum magnitude" />
        <MetricCard label="Countries" value={stats.countries} help="Extracted from locations" />
        <MetricCard label="Tsunami" value={stats.tsunami} help="Official tsunami flag" />
      </section>
      <section className="mb-12 grid gap-12 xl:grid-cols-1">
        <MapCanvas events={events} selectedId={selectedEvent?.id ?? null} onSelect={select} />
      
      </section>
      <DataTable events={events} onSelect={select} />
    </>
  );
}

function Field({ label, value, setValue, type = 'text' }: { label: string; value: string; setValue: (v: string) => void; type?: string }) {
  return <label className="text-sm font-bold text-slate-600">{label}<input type={type} value={value} min={type === 'date' ? '1990-01-01' : undefined} onChange={(e) => setValue(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-red-500" /></label>;
}

function monthly(events: Earthquake[]) {
  const map = new Map<string, number>();
  events.forEach((e) => {
    const key = new Date(e.time).toISOString().slice(0, 7);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return [...map.entries()].sort().slice(-12);
}
