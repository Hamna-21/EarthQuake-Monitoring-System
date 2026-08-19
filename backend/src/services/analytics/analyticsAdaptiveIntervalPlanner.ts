import type { AnalyticsBackfillPlanInterval } from '../../types/analyticsBackfillPlan';
import type { AnalyticsAdaptiveIntervalNode, AnalyticsAdaptiveIntervalPlan, AnalyticsIntervalSafety } from '../../types/analyticsAdaptiveIntervalPlan';
import type { AnalyticsRegion } from './analyticsQuery';
import { createUsgsRequestForPlannedInterval } from './analyticsIntervalRequest';
import { splitAnalyticsInterval } from './analyticsAdaptiveIntervalSplitter';
import { fetchUsgsAnalyticsCount, type UsgsAnalyticsCountRequest, type UsgsAnalyticsCountResult } from './usgsAnalyticsCountClient';

export type AnalyticsAdaptiveIntervalPlanInput = {
  interval: AnalyticsBackfillPlanInterval; region: AnalyticsRegion;
  minMagnitude: number; maxMagnitude: number | null; minDepth: number | null; maxDepth: number | null;
  safeEventLimit: number; splitThreshold: number; maximumDepth: number; maximumRequests: number;
};
export type AnalyticsAdaptiveIntervalDependencies = {
  countEvents?: (request: UsgsAnalyticsCountRequest, options?: { signal?: AbortSignal }) => Promise<UsgsAnalyticsCountResult>;
  signal?: AbortSignal;
};
const dayMs = 86_400_000;
const validInt = (value: number) => Number.isInteger(value) && value > 0;
const validDate = (date: Date) => date instanceof Date && Number.isFinite(date.getTime());

function validate(input: AnalyticsAdaptiveIntervalPlanInput) {
  if (!validDate(input.interval.startDate) || !validDate(input.interval.endDate)) throw new Error('Adaptive interval dates must be valid.');
  if (input.interval.startDate >= input.interval.endDate) throw new Error('Adaptive interval must have positive duration.');
  if (!validInt(input.safeEventLimit) || !validInt(input.splitThreshold) || input.splitThreshold >= input.safeEventLimit) throw new Error('Adaptive safety limits are invalid.');
  if (!Number.isInteger(input.maximumDepth) || input.maximumDepth < 0 || !validInt(input.maximumRequests)) throw new Error('Adaptive request limits are invalid.');
}

function node(interval: AnalyticsBackfillPlanInterval, level: number): AnalyticsAdaptiveIntervalNode {
  const request = createUsgsRequestForPlannedInterval(interval);
  return {
    intervalKey: interval.intervalKey, startDate: request.plannedStartDate, endDate: request.plannedEndDate,
    requestStartDate: request.requestStartDate, requestEndDate: request.requestEndDate,
    level, eventCount: null, safety: 'unknown', splitReason: null, children: [],
    countRequestExecuted: false, countDiscrepancy: null,
  };
}

const classify = (count: number, threshold: number): AnalyticsIntervalSafety =>
  count === 0 ? 'zero-events' : count <= threshold ? 'safe' : 'split-required';
async function classifyNode(
  current: AnalyticsAdaptiveIntervalNode, source: AnalyticsBackfillPlanInterval,
  input: AnalyticsAdaptiveIntervalPlanInput, state: { requests: number; exhausted: boolean },
  countEvents: AnalyticsAdaptiveIntervalDependencies['countEvents'],
  signal?: AbortSignal,
) {
  if (state.requests >= input.maximumRequests) { state.exhausted = true; current.safety = 'unknown'; current.splitReason = 'Request budget exhausted.'; return; }
  try {
    state.requests += 1;
    const result = await countEvents!({
      region: input.region, startDate: current.requestStartDate, endDate: current.requestEndDate, minMagnitude: input.minMagnitude,
      maxMagnitude: input.maxMagnitude, minDepth: input.minDepth, maxDepth: input.maxDepth,
    }, { signal });
    current.eventCount = result.count;
    current.countRequestExecuted = true;
    current.safety = classify(result.count, input.splitThreshold);
  } catch {
    current.safety = 'unknown'; current.splitReason = 'Count request failed.';
    return;
  }
  if (current.safety !== 'split-required') return;
  if (current.level >= input.maximumDepth || current.endDate.getTime() - current.startDate.getTime() <= dayMs) {
    current.safety = 'minimum-size-unsafe'; current.splitReason = 'Interval cannot be split safely within configured limits.';
    return;
  }
  const [leftSource, rightSource] = splitAnalyticsInterval(source);
  const left = node(leftSource, current.level + 1), right = node(rightSource, current.level + 1);
  current.children = [left, right];
  await classifyNode(left, leftSource, input, state, countEvents, signal);
  await classifyNode(right, rightSource, input, state, countEvents, signal);
  const sum = left.eventCount !== null && right.eventCount !== null ? left.eventCount + right.eventCount : null;
  current.countDiscrepancy = current.eventCount !== null && sum !== null ? current.eventCount - sum : null;
}

function leaves(root: AnalyticsAdaptiveIntervalNode) {
  const all: AnalyticsAdaptiveIntervalNode[] = [];
  const visit = (item: AnalyticsAdaptiveIntervalNode) => item.children.length ? item.children.forEach(visit) : all.push(item);
  visit(root);
  return all;
}
export async function createAdaptiveIntervalPlan(input: AnalyticsAdaptiveIntervalPlanInput, dependencies: AnalyticsAdaptiveIntervalDependencies = {}): Promise<AnalyticsAdaptiveIntervalPlan> {
  // Probe interval risk and recursively split busy periods until each planned request is safe to fetch.
  validate(input);
  const countEvents = dependencies.countEvents ?? fetchUsgsAnalyticsCount;
  const root = node(input.interval, 0);
  const state = { requests: 0, exhausted: false };
  await classifyNode(root, input.interval, input, state, countEvents, dependencies.signal);
  const allLeaves = leaves(root);
  return {
    mode: 'count-only', sourceIntervalKey: input.interval.intervalKey,
    safeEventLimit: input.safeEventLimit, splitThreshold: input.splitThreshold,
    maximumDepth: input.maximumDepth, maximumRequests: input.maximumRequests,
    countRequestsExecuted: state.requests, eventRequestsExecuted: 0, databaseWritesExecuted: 0,
    root, safeLeafIntervals: allLeaves.filter((item) => item.safety === 'safe' || item.safety === 'zero-events'),
    unsafeLeafIntervals: allLeaves.filter((item) => item.safety === 'minimum-size-unsafe'),
    unknownLeafIntervals: allLeaves.filter((item) => item.safety === 'unknown'),
    totalReportedEventCount: root.eventCount, requestBudgetExhausted: state.exhausted,
    warnings: [
      'This plan used USGS count-only requests; no earthquake event records were fetched.',
      state.exhausted ? 'The request budget was exhausted before all intervals could be classified.' : 'The request budget was not exhausted.',
      `Leaf safety states: ${allLeaves.map((item) => item.safety).join(', ') || 'none'}.`,
    ],
  };
}
