import { Earthquake, SeismicFilters } from '../../types';
import { filterAndSortEarthquakes, filterHistoricalByQuery, filterPakistanEvents } from '../../utils/earthquakeFilters';
import { HISTORICAL_EARTHQUAKE_API_URL, LIVE_EARTHQUAKE_API_URL, buildHistoricalQuery, buildLiveQuery } from './earthquakeQuery';
import { cleanEarthquakes } from './earthquakeDataQuality';

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
};

export type HistoricalEarthquakeResponse = {
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextPage: number | null;
  earthquakes: Earthquake[];
};

export const fetchEarthquakes = async (filters: SeismicFilters): Promise<Earthquake[]> => {
  const queryParams = buildLiveQuery(filters);
  const response = await fetch(`${LIVE_EARTHQUAKE_API_URL}?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Earthquake data request failed with status ${response.status}`);
  }

  const data = await response.json();
  const records = Array.isArray(data.earthquakes) ? data.earthquakes : [];
  return filterAndSortEarthquakes(cleanEarthquakes(records, 'live GeoPulse earthquake endpoint'), filters);
};

export const fetchHistoricalEarthquakePage = async (params: HistoricalSearchParams): Promise<HistoricalEarthquakeResponse> => {
  const queryParams = buildHistoricalQuery(params);
  const response = await fetch(`${HISTORICAL_EARTHQUAKE_API_URL}?${queryParams.toString()}`, { signal: params.signal });

  if (!response.ok) {
    const message = await response.json().catch(() => null);
    throw new Error(message?.message ?? `Historical data request failed with status ${response.status}`);
  }

  const data = await response.json();
  const events = cleanEarthquakes(Array.isArray(data.earthquakes) ? data.earthquakes : [], 'historical GeoPulse endpoint');
  const scoped = params.mode === 'pakistan' ? filterPakistanEvents(events) : events;
  return { count: data.count ?? scoped.length, page: data.page ?? 1, limit: data.limit ?? 50, hasMore: Boolean(data.hasMore), nextPage: data.nextPage ?? null, earthquakes: filterHistoricalByQuery(scoped, params.query) };
};

export const fetchHistoricalEarthquakes = async (params: HistoricalSearchParams): Promise<Earthquake[]> =>
  (await fetchHistoricalEarthquakePage(params)).earthquakes;
