import { getAnalyticsDashboardFallback } from './analytics/analyticsDashboardFallback';
import { resolveAnalyticsLocation } from './analytics/analyticsLocationResolver';
import { validateAnalyticsQuery } from './analytics/analyticsQuery';
import type { EarthquakeRecord } from './earthquakeService';

export type HistoricalResponse = {
  success: boolean;
  source: 'USGS';
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
  count: number;
  hasMore: boolean;
  nextPage: number | null;
  earthquakes: EarthquakeRecord[];
};

const cache = new Map<string, { expires: number; data: HistoricalResponse }>();
const CACHE_MS = 30 * 60 * 1000;

const asNumber = (value: unknown, fallback: number) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

function queryForAnalytics(query: Record<string, any>) {
  const mode = text(query.mode ?? query.region).toLowerCase() === 'pakistan' ? 'pakistan' : 'global';
  const location = mode === 'pakistan' ? '' : text(query.location ?? query.query ?? query.regionText);
  return validateAnalyticsQuery({
    region: mode,
    startDate: query.startDate ?? query.start,
    endDate: query.endDate ?? query.end,
    minMagnitude: query.minMagnitude ?? query.minmagnitude,
    maxMagnitude: query.maxMagnitude ?? query.maxmagnitude,
    minDepth: query.minDepth ?? query.mindepth,
    maxDepth: query.maxDepth ?? query.maxdepth,
    location,
  });
}

type MapEvent = {
  usgsId: string;
  magnitude: number | null;
  place: string;
  occurredAt: string;
  updatedAt?: string | null;
  depth: number | null;
  coordinates: number[];
};

function toEarthquake(event: MapEvent): EarthquakeRecord | null {
  // The analytics service stores GeoJSON coordinates as [longitude, latitude, depth].
  const [longitude, latitude, depth] = event.coordinates;
  if (!event.usgsId || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(event.magnitude)) return null;
  return {
    id: event.usgsId,
    magnitude: event.magnitude,
    place: event.place || 'Location unavailable',
    longitude,
    latitude,
    depth: Number.isFinite(depth) ? depth : Number.isFinite(event.depth) ? event.depth : Number.NaN,
    time: event.occurredAt,
    updatedAt: event.updatedAt ?? event.occurredAt,
    alert: null,
    tsunami: false,
    tsunamiCode: null,
    felt: null,
    status: 'historical',
    source: 'USGS',
    detailUrl: '',
    url: '',
    detail: '',
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Resolve historical filters through the analytics data path and return the same records used by the map.
 * Results are cached briefly to avoid repeating identical historical requests during pagination.
 */
export async function fetchHistoricalEarthquakes(query: Record<string, any>): Promise<HistoricalResponse> {
  const page = Math.max(1, Math.floor(asNumber(query.page, 1)));
  const limit = Math.min(Math.max(1, Math.floor(asNumber(query.limit, 50))), 200);
  const cacheKey = JSON.stringify({ endpoint: 'analytics-dashboard-compatible', ...query, page, limit });
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.data;
  const analyticsQuery = await resolveAnalyticsLocation(queryForAnalytics(query));
  const dashboard = await getAnalyticsDashboardFallback(analyticsQuery);
  const records = dashboard.mapEvents.flatMap((event) => {
    const mapped = toEarthquake(event);
    return mapped ? [mapped] : [];
  });
  const start = (page - 1) * limit;
  const result: HistoricalResponse = {
    success: true,
    source: 'USGS',
    startDate: analyticsQuery.startDate.toISOString().slice(0, 10),
    endDate: analyticsQuery.endDate.toISOString().slice(0, 10),
    page,
    limit,
    count: records.length,
    hasMore: records.length > start + limit,
    nextPage: records.length > start + limit ? page + 1 : null,
    earthquakes: records.slice(start, start + limit),
  };
  if (cache.size > 16) cache.delete(cache.keys().next().value as string);
  cache.set(cacheKey, { expires: Date.now() + CACHE_MS, data: result });
  return result;
}
