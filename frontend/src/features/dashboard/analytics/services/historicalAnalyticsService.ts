import type { Earthquake } from '@/types';
import { createDefaultAnalyticsFilters, type AnalyticsFilters } from '@/features/dashboard/analytics/types';
import { parseUsgsCoordinates } from '@/features/earthquakes/services/coordinateParser';

export type HistoricalRow = { label?: string; value?: number; count: number; year?: number; month?: number };
export type HistoricalSummary = {
  totalEvents: number; strongestMagnitude: number | null; averageMagnitude: number | null; averageDepth: number | null; shallowEventCount: number;
  mostActiveYear: { year: number; count: number } | null; mostActiveMonth: { year: number; month: number; label: string; count: number } | null;
};
export type HistoricalMapEvent = { usgsId: string; magnitude: number | null; place: string; occurredAt: string; depth: number | null; coordinates: [number, number] };
export type HistoricalAnalyticsResponse = {
  success: true; summary: HistoricalSummary; yearlyFrequency: HistoricalRow[]; monthlyTimeline: HistoricalRow[];
  calendarMonthFrequency: HistoricalRow[]; magnitudeDistribution: HistoricalRow[]; depthDistribution: HistoricalRow[];
  yearMonthHeatmap: HistoricalRow[]; magnitudeGroups: HistoricalRow[]; mapEvents: HistoricalMapEvent[];
  metadata: { region: AnalyticsFilters['region']; generatedAt: string; documentCount: number; geographicClassification: string; pointInPolygonApplied: boolean; usgsCount?: number; rawFeatureCount?: number; uniqueEventCount?: number; validEventCount?: number; pages?: number; chunks?: number; duplicateCount?: number };
};

const qs = (filters: AnalyticsFilters) => {
  const params = new URLSearchParams({ region: filters.region, startDate: filters.startDate, endDate: filters.endDate, minMagnitude: String(filters.minMagnitude), location: filters.location.trim() });
  if (filters.maxMagnitude !== null) params.set('maxMagnitude', String(filters.maxMagnitude));
  if (filters.minDepth !== null) params.set('minDepth', String(filters.minDepth));
  if (filters.maxDepth !== null) params.set('maxDepth', String(filters.maxDepth));
  return params.toString();
};

const responseCache = new Map<string, HistoricalAnalyticsResponse>();
const responseRequests = new Map<string, Promise<HistoricalAnalyticsResponse>>();

export async function fetchHistoricalAnalytics(filters = createDefaultAnalyticsFilters(), signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException('The historical request was cancelled.', 'AbortError');
  const key = qs(filters);
  const cached = responseCache.get(key);
  if (cached) return cached;
  const request = responseRequests.get(key) ?? fetch(`/api/analytics/dashboard?${key}`, { signal, headers: { Accept: 'application/json' } })
    .then(async (response) => { const data = await response.json().catch(() => null); if (!response.ok || !data?.success) throw new Error(data?.error?.message || 'Historical analytics could not be loaded.'); return data as HistoricalAnalyticsResponse; });
  responseRequests.set(key, request);
  try {
    const data = await request;
    if (signal?.aborted) throw new DOMException('The historical request was cancelled.', 'AbortError');
    if (responseCache.size > 8) responseCache.delete(responseCache.keys().next().value as string);
    responseCache.set(key, data);
    return data;
  } finally { if (responseRequests.get(key) === request) responseRequests.delete(key); }
}

export function mapHistoricalEvents(events: HistoricalMapEvent[]): Earthquake[] {
  return events.flatMap((event) => {
    const point = parseUsgsCoordinates(event.coordinates);
    if (!point || !Number.isFinite(event.magnitude)) return [];
    return [{
      id: event.usgsId, magnitude: event.magnitude!, place: event.place, latitude: point.latitude, longitude: point.longitude, depth: event.depth ?? Number.NaN,
      time: event.occurredAt, updatedAt: event.occurredAt, alert: null, tsunami: false, tsunamiCode: null, felt: null, status: 'historical', source: 'USGS' as const,
    }];
  });
}
