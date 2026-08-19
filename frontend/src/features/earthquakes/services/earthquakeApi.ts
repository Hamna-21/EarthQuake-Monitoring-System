import { Earthquake, SeismicFilters } from '@/types';
import { filterAndSortEarthquakes } from '@/features/earthquakes/utils/earthquakeFilters';
import { HISTORICAL_EARTHQUAKE_API_URL, LIVE_EARTHQUAKE_API_URL, buildHistoricalQuery, buildLiveQuery } from '@/features/earthquakes/services/earthquakeQuery';
import { cleanEarthquakes } from '@/features/earthquakes/services/earthquakeDataQuality';
import type { PlaceFocus } from '@/features/dashboard/map/services/placeSearch';

export type HistoricalSearchParams = {
  startDate: string;
  endDate: string;
  minMagnitude: number;
  maxMagnitude?: number;
  minDepth?: number;
  maxDepth?: number;
  region?: string;
  mode?: 'global' | 'pakistan';
  query?: string;
  sort?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
  locationBounds?: PlaceFocus['bounds'];
};

export type HistoricalEarthquakeResponse = {
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextPage: number | null;
  earthquakes: Earthquake[];
};

const historicalCache = new Map<string, HistoricalEarthquakeResponse>();
const historicalRequests = new Map<string, Promise<HistoricalEarthquakeResponse>>();

// Fetch live events, clean malformed coordinates, and apply the same filters used by the dashboard.
export const fetchEarthquakes = async (filters: SeismicFilters, signal?: AbortSignal): Promise<Earthquake[]> => {
  const queryParams = buildLiveQuery(filters);
  const response = await fetch(`${LIVE_EARTHQUAKE_API_URL}?${queryParams.toString()}`, { signal });

  if (!response.ok) {
    throw new Error(`Earthquake data request failed with status ${response.status}`);
  }

  const data = await response.json();
  const records = Array.isArray(data.earthquakes) ? data.earthquakes : [];
  return filterAndSortEarthquakes(cleanEarthquakes(records, 'live Earthquake Monitoring System earthquake endpoint'), filters);
};

// Deduplicate identical historical requests and cache completed pages without hiding cancellation from callers.
export const fetchHistoricalEarthquakePage = async (params: HistoricalSearchParams): Promise<HistoricalEarthquakeResponse> => {
  if (params.signal?.aborted) throw new DOMException('The historical request was cancelled.', 'AbortError');
  const queryParams = buildHistoricalQuery(params);
  const cacheKey = queryParams.toString();
  const cached = historicalCache.get(cacheKey);
  if (cached) return cached;
  const request = historicalRequests.get(cacheKey) ?? fetch(`${HISTORICAL_EARTHQUAKE_API_URL}?${queryParams.toString()}`, { signal: params.signal })
    .then(async (response) => {
      if (!response.ok) {
        const message = await response.json().catch(() => null);
        throw new Error(message?.message ?? `Historical data request failed with status ${response.status}`);
      }
      const data = await response.json();
      const events = cleanEarthquakes(Array.isArray(data.earthquakes) ? data.earthquakes : [], 'historical Earthquake Monitoring System endpoint');
      return { count: data.count ?? events.length, page: data.page ?? 1, limit: data.limit ?? 50, hasMore: Boolean(data.hasMore), nextPage: data.nextPage ?? null, earthquakes: events };
    });
  historicalRequests.set(cacheKey, request);
  try {
    const result = await request;
    if (params.signal?.aborted) throw new DOMException('The historical request was cancelled.', 'AbortError');
    if (historicalCache.size > 24) historicalCache.delete(historicalCache.keys().next().value as string);
    historicalCache.set(cacheKey, result);
    return result;
  } finally {
    if (historicalRequests.get(cacheKey) === request) historicalRequests.delete(cacheKey);
  }
};

export const fetchHistoricalEarthquakes = async (params: HistoricalSearchParams): Promise<Earthquake[]> =>
  (await fetchHistoricalEarthquakePage(params)).earthquakes;

