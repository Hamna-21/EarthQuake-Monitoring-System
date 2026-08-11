import type { Earthquake } from '@/types';
import { createDefaultAnalyticsFilters, type AnalyticsFilters } from '@/features/dashboard/analytics/types';

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

export async function fetchHistoricalAnalytics(filters = createDefaultAnalyticsFilters(), signal?: AbortSignal) {
  const response = await fetch(`/api/analytics/dashboard?${qs(filters)}`, { signal, headers: { Accept: 'application/json' } });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) throw new Error(data?.error?.message || 'Historical analytics could not be loaded.');
  return data as HistoricalAnalyticsResponse;
}

export function mapHistoricalEvents(events: HistoricalMapEvent[]): Earthquake[] {
  return events.flatMap((event) => {
    const [longitude, latitude] = event.coordinates ?? [];
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || !Number.isFinite(event.magnitude)) return [];
    return [{
      id: event.usgsId, magnitude: event.magnitude!, place: event.place, latitude, longitude, depth: Number.isFinite(event.depth) ? event.depth! : Number.NaN,
      time: event.occurredAt, updatedAt: event.occurredAt, alert: null, tsunami: false, tsunamiCode: null, felt: null, status: 'historical', source: 'USGS' as const,
    }];
  });
}
