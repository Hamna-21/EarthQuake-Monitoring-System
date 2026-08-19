import type { Earthquake } from '@/types';
import type { AnalyticsSummary, CalendarMonthFrequencyPoint, DepthDistribution, HeatmapCell, HistogramBin, MagnitudeDistribution, MagnitudeGroups, MonthlyFrequencyPoint, YearlyFrequencyPoint } from '@/features/dashboard/analytics/types';
import { eventsInRange, forEachMonth, monthFullLabels, monthKey, monthLabel, monthShortLabels, readDateRange } from '@/features/dashboard/analytics/utils/analyticsDateUtils';
const emptyGroups = (): MagnitudeGroups => ({ '4.0-4.9': [], '5.0-5.9': [], '6.0-6.9': [], '7.0+': [] });
const inc = (counts: Map<string, number>, key: string) => counts.set(key, (counts.get(key) ?? 0) + 1);
const finite = (value: number) => Number.isFinite(value);
const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const depthBins: HistogramBin[] = [
  { key: '0-10', label: '0–10 km', count: 0 },
  { key: '10-30', label: '>10–30 km', count: 0 },
  { key: '30-70', label: '>30–70 km', count: 0 },
  { key: '70-150', label: '>70–150 km', count: 0 },
  { key: '150-300', label: '>150–300 km', count: 0 },
  { key: '300-plus', label: '>300 km', count: 0 },
];
const magBins: HistogramBin[] = [
  { key: 'below-4', label: 'Below 4.0', count: 0 },
  { key: '4-4.9', label: '4.0–4.9', count: 0 },
  { key: '5-5.9', label: '5.0–5.9', count: 0 },
  { key: '6-6.9', label: '6.0–6.9', count: 0 },
  { key: '7-7.9', label: '7.0–7.9', count: 0 },
  { key: '8-plus', label: '8.0+', count: 0 },
];
export function buildYearlyFrequency(events: readonly Earthquake[], startDate: string, endDate: string): YearlyFrequencyPoint[] {
  // Transform event timestamps into complete chart series, including zero-count periods in the selected range.
  const range = readDateRange(startDate, endDate);
  const counts = new Map<number, number>();
  eventsInRange(events, startDate, endDate).forEach(({ date }) => counts.set(date.getUTCFullYear(), (counts.get(date.getUTCFullYear()) ?? 0) + 1));
  return Array.from({ length: range.endYear - range.startYear + 1 }, (_, index) => ({ year: range.startYear + index, count: counts.get(range.startYear + index) ?? 0 }));
}
export function buildMonthlyTimeline(events: readonly Earthquake[], startDate: string, endDate: string): MonthlyFrequencyPoint[] {
  const range = readDateRange(startDate, endDate);
  const counts = new Map<string, number>();
  eventsInRange(events, startDate, endDate).forEach(({ date }) => inc(counts, monthKey(date.getUTCFullYear(), date.getUTCMonth() + 1)));
  const rows: MonthlyFrequencyPoint[] = [];
  forEachMonth(range.startYear, range.startMonth, range.endYear, range.endMonth, (year, month) => rows.push({ key: monthKey(year, month), label: monthLabel(year, month), year, month, count: counts.get(monthKey(year, month)) ?? 0 }));
  return rows;
}
export function buildCalendarMonthFrequency(events: readonly Earthquake[], startDate: string, endDate: string): CalendarMonthFrequencyPoint[] {
  const counts = Array(12).fill(0) as number[];
  eventsInRange(events, startDate, endDate).forEach(({ date }) => { counts[date.getUTCMonth()] += 1; });
  return counts.map((count, index) => ({ month: index + 1, shortLabel: monthShortLabels[index], fullLabel: monthFullLabels[index], count }));
}
export function buildDepthDistribution(events: readonly Earthquake[], startDate: string, endDate: string): DepthDistribution {
  // Bin valid depths while tracking missing values so chart totals remain explainable.
  const bins = depthBins.map((bin) => ({ ...bin }));
  let validDepthCount = 0, missingDepthCount = 0, shallowEventCount = 0;
  eventsInRange(events, startDate, endDate).forEach(({ event }) => {
    const depth = event.depth;
    if (!finite(depth) || depth < 0) { missingDepthCount += 1; return; }
    validDepthCount += 1;
    if (depth <= 70) shallowEventCount += 1;
    bins[depth <= 10 ? 0 : depth <= 30 ? 1 : depth <= 70 ? 2 : depth <= 150 ? 3 : depth <= 300 ? 4 : 5].count += 1;
  });
  return { bins, validDepthCount, missingDepthCount, shallowEventCount };
}
export function buildMagnitudeDistribution(events: readonly Earthquake[], startDate: string, endDate: string): MagnitudeDistribution {
  const bins = magBins.map((bin) => ({ ...bin }));
  let validMagnitudeCount = 0, missingMagnitudeCount = 0;
  eventsInRange(events, startDate, endDate).forEach(({ event }) => {
    const magnitude = event.magnitude;
    if (!finite(magnitude)) { missingMagnitudeCount += 1; return; }
    validMagnitudeCount += 1;
    bins[magnitude < 4 ? 0 : magnitude < 5 ? 1 : magnitude < 6 ? 2 : magnitude < 7 ? 3 : magnitude < 8 ? 4 : 5].count += 1;
  });
  return { bins, validMagnitudeCount, missingMagnitudeCount };
}
export function buildYearMonthHeatmap(events: readonly Earthquake[], startDate: string, endDate: string): HeatmapCell[] {
  const range = readDateRange(startDate, endDate);
  const counts = new Map<string, number>();
  eventsInRange(events, startDate, endDate).forEach(({ date }) => inc(counts, monthKey(date.getUTCFullYear(), date.getUTCMonth() + 1)));
  return Array.from({ length: range.endYear - range.startYear + 1 }).flatMap((_, yearIndex) => monthShortLabels.map((monthLabelText, monthIndex) => ({ year: range.startYear + yearIndex, month: monthIndex + 1, monthLabel: monthLabelText, count: counts.get(monthKey(range.startYear + yearIndex, monthIndex + 1)) ?? 0 })));
}
export function buildMagnitudeGroups(events: readonly Earthquake[], startDate: string, endDate: string): MagnitudeGroups {
  const groups = emptyGroups();
  eventsInRange(events, startDate, endDate).forEach(({ event }) => {
    const mag = event.magnitude;
    if (!finite(mag) || mag < 4) return;
    groups[mag < 5 ? '4.0-4.9' : mag < 6 ? '5.0-5.9' : mag < 7 ? '6.0-6.9' : '7.0+'].push(event);
  });
  Object.values(groups).forEach((items) => items.sort((a, b) => Date.parse(b.time) - Date.parse(a.time)));
  return groups;
}
export function calculateAnalyticsSummary(events: readonly Earthquake[], startDate: string, endDate: string): AnalyticsSummary {
  const timed = eventsInRange(events, startDate, endDate);
  const inRange = timed.map(({ event }) => event);
  const magnitudes = inRange.map((event) => event.magnitude).filter(finite);
  const depths = inRange.map((event) => event.depth).filter((depth) => finite(depth) && depth >= 0);
  const yearly = buildYearlyFrequency(events, startDate, endDate);
  const months = buildCalendarMonthFrequency(events, startDate, endDate);
  // Ties keep the earliest year/month because the reducer only replaces on a strictly larger count.
  const mostActiveYear = timed.length ? yearly.reduce((best, row) => row.count > best.count ? row : best) : null;
  const mostActiveMonth = timed.length ? months.reduce((best, row) => row.count > best.count ? row : best) : null;
  return { totalEvents: timed.length, strongestMagnitude: magnitudes.length ? Math.max(...magnitudes) : null, averageMagnitude: average(magnitudes), averageDepth: average(depths), shallowEventCount: depths.filter((depth) => depth <= 70).length, mostActiveYear, mostActiveMonth };
}
