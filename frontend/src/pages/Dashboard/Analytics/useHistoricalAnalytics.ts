import { useCallback, useEffect, useRef, useState } from 'react';
import { createDefaultAnalyticsFilters, type AnalyticsFilters } from './analyticsTypes';
import { fetchHistoricalAnalytics, type HistoricalAnalyticsResponse } from './historicalAnalyticsApi';

export function useHistoricalAnalytics(active: boolean) {
  const [filters, setFilters] = useState<AnalyticsFilters>(() => createDefaultAnalyticsFilters());
  const [data, setData] = useState<HistoricalAnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  const load = useCallback(async (next = filters) => {
    if (loadingRef.current) abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller; loadingRef.current = true; setIsLoading(true); setError(null);
    try {
      const result = await fetchHistoricalAnalytics(next, controller.signal);
      setData(result);
    } catch (err) {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Historical analytics failed.');
    } finally {
      if (abortRef.current === controller) { loadingRef.current = false; setIsLoading(false); }
    }
  }, [filters]);

  useEffect(() => {
    if (active) void load(filters);
    return () => abortRef.current?.abort();
  }, [active, filters, load]);

  const updateFilters = (patch: Partial<AnalyticsFilters>) => setFilters((current) => ({ ...current, ...patch }));
  const reset = () => setFilters(createDefaultAnalyticsFilters());
  return { filters, updateFilters, reset, data, error, isLoading, refresh: () => load(filters) };
}
