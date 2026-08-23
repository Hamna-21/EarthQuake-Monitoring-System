import type { AnalyticsIntervalSafety } from '../../types/analyticsAdaptiveIntervalPlan';
import { createAnalyticsBackfillPlan } from './analyticsBackfillPlanner';
import { createUsgsRequestForPlannedInterval } from './analyticsIntervalRequest';
import { fetchUsgsAnalyticsCount, type UsgsAnalyticsCountRequest, type UsgsAnalyticsCountResult } from './usgsAnalyticsCountClient';

export type AnalyticsFullCountInterval = {
  intervalKey: string;
  startDate: string;
  endDate: string;
  eventCount: number | null;
  safety: AnalyticsIntervalSafety;
};

export type AnalyticsFullCountPlan = {
  mode: 'yearly-count-only';
  totalIntervals: number;
  countRequestsExecuted: number;
  safeIntervals: number;
  zeroEventIntervals: number;
  splitRequiredIntervals: number;
  unknownIntervals: number;
  totalReportedCount: number;
  largestIntervalCount: number | null;
  largestIntervalYear: string | null;
  intervals: AnalyticsFullCountInterval[];
};

export type AnalyticsFullCountPlanOptions = {
  now?: Date;
  maximumRequests?: number;
  countEvents?: (request: UsgsAnalyticsCountRequest, options?: { signal?: AbortSignal }) => Promise<UsgsAnalyticsCountResult>;
  signal?: AbortSignal;
};

const threshold = 16000;
const startDate = new Date('1975-01-01T00:00:00.000Z');
const classify = (count: number): AnalyticsIntervalSafety =>
  count === 0 ? 'zero-events' : count <= threshold ? 'safe' : 'split-required';

// Count each planned Pakistan interval first, identifying safe, empty, and split-required years before fetching records.
export async function createPakistanYearlyFullCountPlan(options: AnalyticsFullCountPlanOptions = {}): Promise<AnalyticsFullCountPlan> {
  const now = options.now ? new Date(options.now.getTime()) : new Date();
  const maximumRequests = options.maximumRequests ?? 60;
  const countEvents = options.countEvents ?? fetchUsgsAnalyticsCount;
  const plan = createAnalyticsBackfillPlan({
    region: 'pakistan', startDate, endDate: now, minMagnitude: 4,
    maxMagnitude: null, minDepth: null, maxDepth: null, granularity: 'year',
  }, now);
  let countRequestsExecuted = 0;
  const intervals: AnalyticsFullCountInterval[] = [];
  for (const interval of plan.intervals) {
    if (countRequestsExecuted >= maximumRequests) {
      intervals.push({ intervalKey: interval.intervalKey, startDate: interval.startDateIso, endDate: interval.endDateIso, eventCount: null, safety: 'unknown' });
      continue;
    }
    const request = createUsgsRequestForPlannedInterval(interval);
    try {
      countRequestsExecuted += 1;
      const result = await countEvents({
        region: 'pakistan', startDate: request.requestStartDate, endDate: request.requestEndDate,
        minMagnitude: 4, maxMagnitude: null, minDepth: null, maxDepth: null,
      }, { signal: options.signal });
      intervals.push({ intervalKey: interval.intervalKey, startDate: interval.startDateIso, endDate: interval.endDateIso, eventCount: result.count, safety: classify(result.count) });
    } catch {
      intervals.push({ intervalKey: interval.intervalKey, startDate: interval.startDateIso, endDate: interval.endDateIso, eventCount: null, safety: 'unknown' });
    }
  }
  const counted = intervals.filter((item) => item.eventCount !== null);
  const largest = counted.reduce<AnalyticsFullCountInterval | null>((best, item) =>
    !best || item.eventCount! > best.eventCount! ? item : best, null);
  return {
    mode: 'yearly-count-only', totalIntervals: intervals.length, countRequestsExecuted,
    safeIntervals: intervals.filter((item) => item.safety === 'safe').length,
    zeroEventIntervals: intervals.filter((item) => item.safety === 'zero-events').length,
    splitRequiredIntervals: intervals.filter((item) => item.safety === 'split-required').length,
    unknownIntervals: intervals.filter((item) => item.safety === 'unknown').length,
    totalReportedCount: counted.reduce((sum, item) => sum + item.eventCount!, 0),
    largestIntervalCount: largest?.eventCount ?? null,
    largestIntervalYear: largest?.startDate.slice(0, 4) ?? null,
    intervals,
  };
}
