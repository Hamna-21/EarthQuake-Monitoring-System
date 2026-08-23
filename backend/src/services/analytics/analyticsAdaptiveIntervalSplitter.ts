import type { AnalyticsBackfillPlanInterval, AnalyticsBackfillIntervalRisk } from '../../types/analyticsBackfillPlan';
import { AnalyticsBackfillPlanError } from './analyticsBackfillPlanner';

const dayMs = 86_400_000;
const copy = (date: Date) => new Date(date.getTime());
const valid = (date: Date) => date instanceof Date && Number.isFinite(date.getTime());
const boundary = (date: Date) => date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0 && date.getUTCMilliseconds() === 0;
const durationDays = (start: Date, end: Date) => Math.max(1, Math.ceil((end.getTime() - start.getTime()) / dayMs));

/** Coordinates fail for this module. */
function fail(message: string): never {
  throw new AnalyticsBackfillPlanError(message);
}

/** Coordinates natural midpoint for this module. */
function naturalMidpoint(start: Date, end: Date) {
  const midpoint = (start.getTime() + end.getTime()) / 2;
  let cursor = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
  let best: Date | null = null;
  while (cursor.getTime() > start.getTime() && cursor.getTime() < end.getTime()) {
    if (!best || Math.abs(cursor.getTime() - midpoint) < Math.abs(best.getTime() - midpoint)) best = cursor;
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
  }
  return best;
}

/** Builds the split point result used by the surrounding workflow. */
function splitPoint(start: Date, end: Date) {
  const natural = naturalMidpoint(start, end);
  if (natural) return natural;
  return new Date(Math.floor((start.getTime() + end.getTime()) / 2));
}

/** Coordinates child risk for this module. */
function childRisk(start: Date, end: Date): AnalyticsBackfillIntervalRisk {
  const days = durationDays(start, end);
  return boundary(start) && boundary(end) && days <= 366 ? 'standard' : 'partial-boundary';
}

/** Coordinates child for this module. */
function child(interval: AnalyticsBackfillPlanInterval, start: Date, end: Date, index: 0 | 1) {
  return {
    ...interval,
    index,
    intervalKey: `${interval.intervalKey}:split:${index}:${start.toISOString()}:${end.toISOString()}`,
    startDate: copy(start),
    endDate: copy(end),
    startDateIso: start.toISOString(),
    endDateIso: end.toISOString(),
    durationDays: durationDays(start, end),
    isFirst: index === 0,
    isLast: index === 1,
    isPartialBoundary: childRisk(start, end) === 'partial-boundary',
    risk: childRisk(start, end),
  };
}

// Split an oversized backfill interval at a stable calendar boundary so child requests are easier to retry.
export function splitAnalyticsInterval(
  interval: AnalyticsBackfillPlanInterval,
): [AnalyticsBackfillPlanInterval, AnalyticsBackfillPlanInterval] {
  const start = copy(interval.startDate);
  const end = copy(interval.endDate);
  if (!valid(start) || !valid(end)) fail('Cannot split an interval with invalid dates.');
  if (end.getTime() - start.getTime() <= 1) fail('Cannot split an interval without positive child durations.');
  const mid = splitPoint(start, end);
  if (mid.getTime() <= start.getTime() || mid.getTime() >= end.getTime()) fail('Interval split point must be inside the interval.');
  return [child(interval, start, mid, 0), child(interval, mid, end, 1)];
}
