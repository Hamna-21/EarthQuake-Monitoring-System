import { useState } from 'react';
import { Earthquake } from '../../../types';
import { fetchHistoricalEarthquakes } from '../../../utils/usgsApi';
import { DataTable } from '../../../components/dashboard/ui';
import MapCanvas from '../../../components/dashboard/MapCanvas';
import { statsFor } from '../../../components/dashboard/data';
import { DashboardProps } from '../../../components/dashboard/types';
import HistoryHeader from './components/HistoryHeader';
import { HistoryFilters } from './components/HistoryFilters';
import HistoryMetrics from './components/HistoryMetrics';

export default function HistoryPage({ selectedEvent, setSelectedId, setSelectedEvent, openPage }: DashboardProps) {
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
      <HistoryHeader />
      <HistoryFilters
        startDate={startDate}
        endDate={endDate}
        minMag={minMag}
        query={query}
        loading={loading}
        error={error}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setMinMag={setMinMag}
        setQuery={setQuery}
        onSearch={search}
      />
      <HistoryMetrics
        records={events.length}
        strongest={events.length ? stats.strongest.toFixed(1) : '—'}
        countries={stats.countries}
        tsunami={stats.tsunami}
      />
      <section className="mb-6 overflow-hidden rounded-2xl border border-rose-500/20 shadow-2xl">
        <MapCanvas events={events} selectedId={selectedEvent?.id ?? null} onSelect={select} />
      </section>
      <DataTable events={events} onSelect={select} />
    </>
  );
}


