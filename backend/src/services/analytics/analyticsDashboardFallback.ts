import type { AnalyticsEarthquake } from './normalizeAnalyticsEarthquake';
import type { ValidatedAnalyticsQuery } from './analyticsQuery';
import { pointInPolygon } from '../pakistanBoundary';
import { fetchCompleteAnalyticsQuery } from './analyticsCompleteFetch';
import { insideResolvedLocation } from './analyticsLocationResolver';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const magBins = ['Below 4.0', '4.0-4.9', '5.0-5.9', '6.0-6.9', '7.0-7.9', '8.0+'];
const depthBins = ['0-10', '>10-30', '>30-70', '>70-150', '>150-300', '>300'];
const years = (start: Date, end: Date) => Array.from({ length: end.getUTCFullYear() - start.getUTCFullYear() + 1 }, (_, i) => start.getUTCFullYear() + i);
const magLabel = (mag: number | null) => mag === null ? null : mag < 4 ? magBins[0] : mag < 5 ? magBins[1] : mag < 6 ? magBins[2] : mag < 7 ? magBins[3] : mag < 8 ? magBins[4] : magBins[5];
const depthLabel = (depth: number | null) => depth === null ? null : depth <= 10 ? depthBins[0] : depth <= 30 ? depthBins[1] : depth <= 70 ? depthBins[2] : depth <= 150 ? depthBins[3] : depth <= 300 ? depthBins[4] : depthBins[5];
const avg = (items: number[]) => items.length ? items.reduce((sum, item) => sum + item, 0) / items.length : null;
const neighboringCountry = /\b(?:afghanistan|china|india|iran|kyrgyzstan|tajikistan)\b/i;

function countBy<T extends string | number>(items: T[]) {
  const map = new Map<T, number>();
  items.forEach((item) => map.set(item, (map.get(item) ?? 0) + 1));
  return map;
}

function fillYears(events: AnalyticsEarthquake[], range: number[]) {
  const counts = countBy(events.map((event) => new Date(event.time).getUTCFullYear()));
  return range.map((year) => ({ year, count: counts.get(year) ?? 0 }));
}

function fillMonths(events: AnalyticsEarthquake[], range: number[]) {
  const counts = countBy(events.map((event) => {
    const date = new Date(event.time);
    return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
  }));
  return range.flatMap((year) => months.map((label, index) => ({
    year, month: index + 1, label, count: counts.get(`${year}-${index + 1}`) ?? 0,
  })));
}

function fillCalendar(events: AnalyticsEarthquake[]) {
  const counts = countBy(events.map((event) => new Date(event.time).getUTCMonth() + 1));
  return months.map((month, index) => ({ month, count: counts.get(index + 1) ?? 0 }));
}

function fillBins(events: AnalyticsEarthquake[], labels: string[], read: (event: AnalyticsEarthquake) => string | null) {
  const counts = countBy(events.map(read).filter(Boolean) as string[]);
  return labels.map((label) => ({ label, count: counts.get(label) ?? 0 }));
}

export async function getAnalyticsDashboardFallback(query: ValidatedAnalyticsQuery) {
  const response = await fetchCompleteAnalyticsQuery(query);
  const events = response.events.filter((event) => {
    if (query.region === 'pakistan' && (!pointInPolygon(event.longitude, event.latitude) || neighboringCountry.test(event.place))) return false;
    if (query.region === 'global' && (!insideResolvedLocation(query, event.longitude, event.latitude) || (query.location && !event.place.toLowerCase().includes(query.location.toLowerCase())))) return false;
    return true;
  });
  const yearRange = years(query.startDate, query.endDate);
  const yearlyFrequency = fillYears(events, yearRange);
  const monthlyTimeline = fillMonths(events, yearRange);
  const magnitudes = events.map((event) => event.magnitude).filter((value): value is number => value !== null);
  const depths = events.map((event) => event.depth).filter((value): value is number => value !== null);
  const mostActiveYear = [...yearlyFrequency].sort((a, b) => b.count - a.count || a.year - b.year)[0] ?? null;
  const mostActiveMonth = [...monthlyTimeline].sort((a, b) => b.count - a.count || a.year - b.year || a.month - b.month)[0] ?? null;
  return {
    summary: {
      totalEvents: events.length, strongestMagnitude: magnitudes.length ? Math.max(...magnitudes) : null,
      averageMagnitude: avg(magnitudes), averageDepth: avg(depths),
      shallowEventCount: events.filter((event) => event.depth !== null && event.depth <= 70).length,
      mostActiveYear, mostActiveMonth,
    },
    yearlyFrequency, monthlyTimeline, calendarMonthFrequency: fillCalendar(events),
    magnitudeDistribution: fillBins(events, magBins, (event) => magLabel(event.magnitude)),
    depthDistribution: fillBins(events, depthBins, (event) => depthLabel(event.depth)),
    yearMonthHeatmap: monthlyTimeline,
    magnitudeGroups: fillBins(events, magBins, (event) => magLabel(event.magnitude)),
    mapEvents: events.map((event) => ({
      usgsId: event.usgsId, magnitude: event.magnitude, place: event.place,
      occurredAt: event.time, depth: event.depth, coordinates: [event.longitude, event.latitude],
    })),
    metadata: { region: query.region, dataMode: 'historical' as const, source: 'USGS' as const, geographicClassification: query.region === 'pakistan' ? 'Pakistan boundary' : 'global', pointInPolygonApplied: query.region === 'pakistan', generatedAt: new Date().toISOString(), documentCount: events.length, usgsCount: response.expectedCount, rawFeatureCount: response.rawFeatureCount, uniqueEventCount: response.events.length, validEventCount: events.length, pages: response.pages, chunks: response.chunks, duplicateCount: response.duplicateCount },
  };
}
