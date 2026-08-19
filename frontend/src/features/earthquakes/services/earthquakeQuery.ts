import { SeismicFilters } from '@/types';

export const EARTHQUAKE_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
export const LIVE_EARTHQUAKE_API_URL = '/api/earthquakes';
export const HISTORICAL_EARTHQUAKE_API_URL = '/api/earthquakes/history';

// Convert the selected live time window into the upstream ISO start time.
export function getTimeRangeParams(timeframe: string): { starttime: string } {
  const now = new Date();
  const ranges: Record<string, number> = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  };
  const msAgo = ranges[timeframe] ?? ranges['24h'];
  return { starttime: new Date(now.getTime() - msAgo).toISOString() };
}

export function buildLiveQuery(filters: SeismicFilters) {
  return new URLSearchParams({
    timeframe: filters.timeframe,
    minMagnitude: filters.minMagnitude.toString(),
    region: filters.region,
    limit: '150',
  });
}

export function buildHistoricalQuery(params: {
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
  locationBounds?: { south: number; north: number; west: number; east: number };
}) {
  // Keep optional magnitude, depth, and geographic bounds out of the request unless the user supplied them.
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
    minMagnitude: params.minMagnitude.toString(),
    mode: params.mode ?? 'global',
    region: params.mode ?? params.region ?? 'global',
    query: params.query ?? '',
    sort: params.sort ?? 'time',
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 50),
  });
  if (params.maxMagnitude !== undefined) queryParams.set('maxMagnitude', params.maxMagnitude.toString());
  if (params.minDepth !== undefined) queryParams.set('minDepth', params.minDepth.toString());
  if (params.maxDepth !== undefined) queryParams.set('maxDepth', params.maxDepth.toString());
  if (params.locationBounds) {
    queryParams.set('minlatitude', String(params.locationBounds.south));
    queryParams.set('maxlatitude', String(params.locationBounds.north));
    queryParams.set('minlongitude', String(params.locationBounds.west));
    queryParams.set('maxlongitude', String(params.locationBounds.east));
  }
  return queryParams;
}
