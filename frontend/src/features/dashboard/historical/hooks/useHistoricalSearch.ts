import { useCallback, useEffect, useRef, useState } from 'react';
import type { Earthquake } from '@/types';
import { fetchHistoricalEarthquakePage } from '@/features/earthquakes/services/earthquakeApi';
import { useDashboardPageState } from '@/features/dashboard/hooks/DashboardStateContext';
import { resolvePlace } from '@/features/dashboard/map/services/placeSearch';

/** Handles use historical search and keeps the related frontend state or data flow consistent. */
export function useHistoricalSearch(mode: 'global' | 'pakistan', globalSearch = '') {
  const today = () => new Date().toISOString().slice(0, 10);
  const defaultStart = () => `${new Date().toISOString().slice(0, 4)}-01-01`;
  const key = `history:${mode}`;
  const [startDate, setStartDate] = useDashboardPageState(`${key}:start`, defaultStart(), true);
  const [endDate, setEndDate] = useDashboardPageState(`${key}:end`, today(), true);
  const [minMag, setMinMag] = useDashboardPageState(`${key}:magnitude`, 4, true);
  const [query, setQuery] = useDashboardPageState(`${key}:query`, '', true);
  const [events, setEvents] = useDashboardPageState<Earthquake[]>(`${key}:events`, []);
  const [page, setPage] = useDashboardPageState(`${key}:page`, 1);
  const [hasMore, setHasMore] = useDashboardPageState(`${key}:has-more`, false);
  const [searched, setSearched] = useDashboardPageState(`${key}:searched`, false);
  const [searchedQuery, setSearchedQuery] = useDashboardPageState(`${key}:searched-query`, '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const active = useRef<AbortController | null>(null);
  const activeKey = useRef<string | null>(null);
  const requestId = useRef(0);

  const validate = (values: { startDate: string; endDate: string; minMag: number }) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(values.endDate)) return 'Dates must use YYYY-MM-DD format.';
    if (values.startDate < '1975-01-01') return 'Historical earthquake data is available from 1975 onward.';
    if (values.endDate > today()) return 'End date cannot be in the future.';
    if (values.startDate > values.endDate) return 'Start date cannot be later than end date.';
    if (values.minMag < 0 || values.minMag > 10) return 'Minimum magnitude must be between 0 and 10.';
    return null;
  };

  const search = useCallback(async (nextPage = 1, overrides: Partial<{ startDate: string; endDate: string; minMag: number; query: string; }> = {}) => {
    // Abort superseded searches and use a request id so records and markers always come from one final dataset.
    const current = { startDate, endDate, minMag, query, ...overrides };
    const requestKey = JSON.stringify({ mode, ...current, page: nextPage });
    if (loading && activeKey.current === requestKey) return;
    const validationError = validate(current);
    if (validationError) { setError(validationError); return; }
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    activeKey.current = requestKey;
    const id = ++requestId.current;
    setLoading(true);
    if (nextPage === 1) setEvents([]);
    setError(null);
    try {
      const cleanQuery = mode === 'pakistan' && current.query.trim().toLowerCase() === 'pakistan' ? '' : current.query.trim();
      if (nextPage === 1) setSearchedQuery(cleanQuery);
      const place = cleanQuery ? await resolvePlace(cleanQuery, controller.signal) : null;
      if (cleanQuery && !place) throw new Error(`Location was not found for "${cleanQuery}".`);
      const result = await fetchHistoricalEarthquakePage({
        startDate: current.startDate,
        endDate: current.endDate,
        minMagnitude: current.minMag,
        query: cleanQuery,
        mode,
        page: nextPage,
        limit: 50,
        signal: controller.signal,
        locationBounds: place?.bounds,
      });
      if (id !== requestId.current) return;
      setEvents(result.earthquakes);
      setPage(result.page);
      setHasMore(result.hasMore);
      setSearched(true);
      setSearchedQuery(cleanQuery);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Historical search failed');
    } finally {
      if (id === requestId.current) { activeKey.current = null; setLoading(false); }
    }
  }, [endDate, loading, minMag, mode, query, startDate]);

  useEffect(() => { if (globalSearch) setQuery(globalSearch); }, [globalSearch, setQuery]);
  useEffect(() => () => active.current?.abort(), []);

  const reset = () => {
    const resetEndDate = today();
    const resetStartDate = defaultStart();
    setStartDate(resetStartDate);
    setEndDate(resetEndDate);
    setMinMag(4);
    setQuery(globalSearch);
    setPage(1);
    search(1, { startDate: resetStartDate, endDate: resetEndDate, minMag: 4, query: globalSearch });
  };

  return {
    startDate, endDate, minMag, query, events, page, hasMore, searched, searchedQuery, loading, error,
    setStartDate, setEndDate, setMinMag, setQuery, search, reset,
  };
}
