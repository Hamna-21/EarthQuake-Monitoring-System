import { SeismicFilters } from '../types';

export const EARTHQUAKE_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

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
  const { starttime } = getTimeRangeParams(filters.timeframe);
  return new URLSearchParams({
    format: 'geojson',
    starttime,
    minmagnitude: filters.minMagnitude.toString(),
    limit: '150',
    orderby: 'time',
  });
}

export function buildHistoricalQuery(params: {
  startDate: string;
  endDate: string;
  minMagnitude: number;
  maxMagnitude?: number;
}) {
  const queryParams = new URLSearchParams({
    format: 'geojson',
    starttime: params.startDate,
    endtime: params.endDate,
    minmagnitude: params.minMagnitude.toString(),
    limit: '20000',
    orderby: 'time',
  });
  if (params.maxMagnitude !== undefined) {
    queryParams.set('maxmagnitude', params.maxMagnitude.toString());
  }
  return queryParams;
}
