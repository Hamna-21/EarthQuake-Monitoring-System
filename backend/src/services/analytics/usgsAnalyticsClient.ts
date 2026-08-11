import { PAKISTAN_ANALYTICS_BOUNDS } from '../../config/pakistanStudyArea';
import type { AnalyticsRegion, ValidatedAnalyticsQuery } from './analyticsQuery';
import { normalizeAnalyticsFeature, type AnalyticsEarthquake, type UsgsFeature } from './normalizeAnalyticsEarthquake';

export const USGS_ANALYTICS_QUERY_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
export const MAX_USGS_ANALYTICS_EVENT_LIMIT = 20000;

export type UsgsAnalyticsRequest = Pick<
  ValidatedAnalyticsQuery,
  'startDate' | 'endDate' | 'region' | 'minMagnitude' | 'maxMagnitude' | 'minDepth' | 'maxDepth' | 'bounds'
> & { limit?: number; offset?: number };

export type UsgsAnalyticsResponse = {
  metadata: { generated: number | null; count: number; status: number | null; title: string | null };
  events: AnalyticsEarthquake[];
  duplicateIds: string[];
  requestUrl: string;
  returnedFeatureCount: number;
  skippedFeatureCount: number;
};

export type UsgsAnalyticsFetchOptions = { timeoutMs?: number; signal?: AbortSignal; allowPartial?: boolean };

export class UsgsAnalyticsError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'UsgsAnalyticsError';
  }
}

const safeLimit = (value: unknown) => Math.min(Math.max(Number(value) || MAX_USGS_ANALYTICS_EVENT_LIMIT, 1), MAX_USGS_ANALYTICS_EVENT_LIMIT);
const num = (value: unknown) => (Number.isFinite(Number(value)) ? Number(value) : null);
const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : null);

function addRegion(params: URLSearchParams, region: AnalyticsRegion) {
  if (region !== 'pakistan') return;
  params.set('minlatitude', String(PAKISTAN_ANALYTICS_BOUNDS.minLatitude));
  params.set('maxlatitude', String(PAKISTAN_ANALYTICS_BOUNDS.maxLatitude));
  params.set('minlongitude', String(PAKISTAN_ANALYTICS_BOUNDS.minLongitude));
  params.set('maxlongitude', String(PAKISTAN_ANALYTICS_BOUNDS.maxLongitude));
}

function addBounds(params: URLSearchParams, bounds: UsgsAnalyticsRequest['bounds']) {
  if (!bounds) return;
  params.set('minlatitude', String(bounds.minLatitude)); params.set('maxlatitude', String(bounds.maxLatitude));
  params.set('minlongitude', String(bounds.minLongitude)); params.set('maxlongitude', String(bounds.maxLongitude));
}

export function buildUsgsAnalyticsParams(request: UsgsAnalyticsRequest) {
  const limit = safeLimit(request.limit);
  const params = new URLSearchParams({
    format: 'geojson',
    eventtype: 'earthquake',
    starttime: request.startDate.toISOString(),
    endtime: request.endDate.toISOString(),
    minmagnitude: String(request.minMagnitude),
    orderby: 'time-asc',
    limit: String(limit),
  });
  if (request.offset) params.set('offset', String(Math.max(Number(request.offset), 1)));
  if (request.maxMagnitude !== null) params.set('maxmagnitude', String(request.maxMagnitude));
  if (request.minDepth !== null) params.set('mindepth', String(request.minDepth));
  if (request.maxDepth !== null) params.set('maxdepth', String(request.maxDepth));
  if (request.region === 'pakistan') addRegion(params, request.region); else addBounds(params, request.bounds);
  return params;
}

function readMetadata(data: Record<string, unknown>) {
  const metadata = data.metadata && typeof data.metadata === 'object' ? data.metadata as Record<string, unknown> : {};
  return {
    generated: num(metadata.generated),
    count: num(metadata.count) ?? 0,
    status: num(metadata.status),
    title: text(metadata.title),
  };
}

export async function fetchAnalyticsInterval(request: UsgsAnalyticsRequest, options: UsgsAnalyticsFetchOptions = {}): Promise<UsgsAnalyticsResponse> {
  const params = buildUsgsAnalyticsParams(request);
  const requestUrl = `${USGS_ANALYTICS_QUERY_URL}?${params.toString()}`;
  const signal = options.signal ?? AbortSignal.timeout(options.timeoutMs ?? 15000);
  const response = await fetch(requestUrl, { signal });
  if (!response.ok) throw new UsgsAnalyticsError(`USGS analytics request failed with status ${response.status}.`, response.status);
  const data = await response.json() as Record<string, unknown>;
  if (!Array.isArray(data.features)) throw new UsgsAnalyticsError('USGS analytics response did not include a features array.', response.status);
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const events: AnalyticsEarthquake[] = [];
  let skippedFeatureCount = 0;
  for (const feature of data.features as UsgsFeature[]) {
    const event = normalizeAnalyticsFeature(feature);
    if (!event) { skippedFeatureCount += 1; continue; }
    if (seen.has(event.id)) { duplicateIds.push(event.id); continue; }
    seen.add(event.id);
    events.push(event);
  }
  const metadata = readMetadata(data);
  if (!options.allowPartial && metadata.count > data.features.length) throw new UsgsAnalyticsError('USGS analytics response was truncated; split this interval before aggregating.', response.status);
  return { metadata, events, duplicateIds, requestUrl, returnedFeatureCount: data.features.length, skippedFeatureCount };
}
