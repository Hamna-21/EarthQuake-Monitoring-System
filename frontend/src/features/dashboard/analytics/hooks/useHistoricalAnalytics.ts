import { useCallback, useEffect, useRef, useState } from 'react';
import { useDashboardPageState } from '@/features/dashboard/hooks/DashboardStateContext';
import { createDefaultAnalyticsFilters, type AnalyticsFilters } from '@/features/dashboard/analytics/types';
import { fetchHistoricalAnalytics, type HistoricalAnalyticsResponse } from '@/features/dashboard/analytics/services/historicalAnalyticsService';

export function useHistoricalAnalytics() {
  const region: AnalyticsFilters['region'] = 'global';
  const [filters, setFilters] = useDashboardPageState('analytics-filters:global', createDefaultAnalyticsFilters(region), true);
  const [data, setData] = useDashboardPageState<HistoricalAnalyticsResponse | null>('analytics-data:global', null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);
  const activeKey = useRef<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async (next: AnalyticsFilters) => {
    const key = JSON.stringify(next);
    if (loadingRef.current && activeKey.current === key) return;
    if (loadingRef.current) abortRef.current?.abort();
    const controller = new AbortController();
    const id = ++requestId.current;
    abortRef.current = controller; activeKey.current = key; loadingRef.current = true; setIsLoading(true); setError(null);
    try {
      const result = await fetchHistoricalAnalytics(next, controller.signal);
      if (id === requestId.current && result.metadata.region === next.region) setData(result);
    } catch (err) {
      if (id === requestId.current && !controller.signal.aborted) setError(err instanceof Error ? err.message : 'Historical analytics failed.');
    } finally {
      if (id === requestId.current && abortRef.current === controller) { loadingRef.current = false; activeKey.current = null; setIsLoading(false); }
    }
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const applyFilters = (next: AnalyticsFilters) => { setFilters(next); void load(next); };
  const reset = () => setFilters(createDefaultAnalyticsFilters(region));
  return { filters, applyFilters, reset, data, error, isLoading, refresh: () => load(filters) };
}
