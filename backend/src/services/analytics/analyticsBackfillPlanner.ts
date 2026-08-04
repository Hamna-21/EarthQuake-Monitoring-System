import type { AnalyticsBackfillPlan, AnalyticsBackfillPlanInput, AnalyticsBackfillPlanInterval, AnalyticsBackfillIntervalRisk } from '../../types/analyticsBackfillPlan';
import { createAnalyticsBackfillJobKey } from './analyticsBackfillProgress';
import { createMonthIntervals, createYearIntervals } from './analyticsIntervals';

const regions = new Set(['pakistan', 'global']);
const granularities = new Set(['year', 'month']);
const risks = new Set(['standard', 'large-date-span', 'partial-boundary']);
const dayMs = 86_400_000;

export class AnalyticsBackfillPlanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalyticsBackfillPlanError';
  }
}

const fail = (message: string): never => { throw new AnalyticsBackfillPlanError(message); };
const copy = (date: Date) => new Date(date.getTime());
const validDate = (date: Date) => date instanceof Date && Number.isFinite(date.getTime());
const utcDayStart = (date: Date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
const boundary = (date: Date) => date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0 && date.getUTCMilliseconds() === 0;
const nextBoundary = (date: Date, granularity: 'year' | 'month') => granularity === 'year'
  ? new Date(Date.UTC(date.getUTCFullYear() + 1, 0, 1))
  : new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));

function durationDays(startDate: Date, endDate: Date) {
  const days = Math.floor((utcDayStart(endDate) - utcDayStart(startDate)) / dayMs);
  return Math.max(1, boundary(endDate) && endDate > startDate ? days : days + 1);
}

function validateInput(input: AnalyticsBackfillPlanInput, generatedAt: Date) {
  if (!regions.has(input.region) || !granularities.has(input.granularity)) fail('Unsupported region or granularity.');
  if (!validDate(input.startDate) || !validDate(input.endDate) || !validDate(generatedAt)) fail('Plan dates must be valid.');
  if (input.startDate > input.endDate) fail('Start date cannot be after end date.');
  if (!Number.isFinite(input.minMagnitude)) fail('Minimum magnitude must be finite.');
  if (input.maxMagnitude !== null && (!Number.isFinite(input.maxMagnitude) || input.minMagnitude > input.maxMagnitude)) fail('Magnitude range is invalid.');
  if (input.minDepth !== null && (!Number.isFinite(input.minDepth) || input.minDepth < 0)) fail('Minimum depth is invalid.');
  if (input.maxDepth !== null && (!Number.isFinite(input.maxDepth) || input.maxDepth < 0)) fail('Maximum depth is invalid.');
  if (input.minDepth !== null && input.maxDepth !== null && input.minDepth > input.maxDepth) fail('Depth range is invalid.');
}

function isNatural(input: AnalyticsBackfillPlanInput, startDate: Date, endDate: Date) {
  const naturalStart = input.granularity === 'year'
    ? startDate.getUTCMonth() === 0 && startDate.getUTCDate() === 1 && boundary(startDate)
    : startDate.getUTCDate() === 1 && boundary(startDate);
  const naturalEnd = nextBoundary(startDate, input.granularity);
  return naturalStart && (endDate.getTime() === naturalEnd.getTime() || endDate.getTime() === naturalEnd.getTime() - 1);
}

function intervalRisk(input: AnalyticsBackfillPlanInput, startDate: Date, endDate: Date): AnalyticsBackfillIntervalRisk {
  const days = durationDays(startDate, endDate);
  if ((input.granularity === 'year' && days > 366) || (input.granularity === 'month' && days > 31)) return 'large-date-span';
  return isNatural(input, startDate, endDate) ? 'standard' : 'partial-boundary';
}

function createInterval(input: AnalyticsBackfillPlanInput, jobKey: string, startDate: Date, endDate: Date, index: number, total: number): AnalyticsBackfillPlanInterval {
  const start = copy(startDate), end = copy(endDate);
  const keyIndex = String(index).padStart(4, '0');
  const risk = intervalRisk(input, start, end);
  return {
    index, intervalKey: `analytics-interval:v1:${jobKey}:${keyIndex}:${start.toISOString()}:${end.toISOString()}`,
    startDate: start, endDate: end, startDateIso: start.toISOString(), endDateIso: end.toISOString(),
    durationDays: durationDays(start, end), isFirst: index === 0, isLast: index === total - 1,
    isPartialBoundary: risk === 'partial-boundary', risk,
  };
}

export function createAnalyticsBackfillPlan(input: AnalyticsBackfillPlanInput, generatedAt: Date = new Date()): AnalyticsBackfillPlan {
  validateInput(input, generatedAt);
  const safeInput = { ...input, startDate: copy(input.startDate), endDate: copy(input.endDate) };
  const jobKey = createAnalyticsBackfillJobKey(safeInput);
  const raw = safeInput.startDate.getTime() === safeInput.endDate.getTime()
    ? [{ start: safeInput.startDate, end: safeInput.endDate }]
    : safeInput.granularity === 'year' ? createYearIntervals(safeInput.startDate, safeInput.endDate) : createMonthIntervals(safeInput.startDate, safeInput.endDate);
  if (!raw.length) fail('Plan must contain at least one interval.');
  const intervals = raw.map((interval, index) => createInterval(safeInput, jobKey, interval.start, interval.end, index, raw.length));
  const plan: AnalyticsBackfillPlan = {
    planVersion: 1, jobKey, region: safeInput.region, requestedStartDate: copy(safeInput.startDate),
    requestedEndDate: copy(safeInput.endDate), minMagnitude: safeInput.minMagnitude, maxMagnitude: safeInput.maxMagnitude,
    minDepth: safeInput.minDepth, maxDepth: safeInput.maxDepth, granularity: safeInput.granularity,
    generatedAt: copy(generatedAt), totalIntervals: intervals.length, intervals,
    firstInterval: intervals[0], finalInterval: intervals[intervals.length - 1],
    estimatedTotalDays: durationDays(safeInput.startDate, safeInput.endDate),
    networkRequestsPlanned: intervals.length, networkRequestsExecuted: 0, databaseWritesPlanned: 0, databaseWritesExecuted: 0,
  };
  validateAnalyticsBackfillPlan(plan);
  return plan;
}

export function validateAnalyticsBackfillPlan(plan: AnalyticsBackfillPlan): void {
  if (plan.planVersion !== 1 || !plan.jobKey.trim() || !validDate(plan.generatedAt)) fail('Plan header is invalid.');
  validateInput({ region: plan.region, startDate: plan.requestedStartDate, endDate: plan.requestedEndDate, minMagnitude: plan.minMagnitude, maxMagnitude: plan.maxMagnitude, minDepth: plan.minDepth, maxDepth: plan.maxDepth, granularity: plan.granularity }, plan.generatedAt);
  if (!plan.intervals.length || plan.totalIntervals !== plan.intervals.length) fail('Plan interval count is invalid.');
  const keys = new Set<string>();
  plan.intervals.forEach((interval, index) => {
    if (interval.index !== index || keys.has(interval.intervalKey)) fail('Interval indexes and keys must be unique and sequential.');
    keys.add(interval.intervalKey);
    if (!validDate(interval.startDate) || !validDate(interval.endDate) || interval.startDate > interval.endDate) fail('Interval dates are invalid.');
    if (interval.startDateIso !== interval.startDate.toISOString() || interval.endDateIso !== interval.endDate.toISOString()) fail('Interval ISO strings are invalid.');
    if (!Number.isInteger(interval.durationDays) || interval.durationDays < 1 || !risks.has(interval.risk)) fail('Interval duration or risk is invalid.');
    if (index > 0 && plan.intervals[index - 1].endDate.getTime() !== interval.startDate.getTime()) fail('Intervals must have no gaps or overlaps.');
  });
  if (plan.intervals[0].startDate.getTime() !== plan.requestedStartDate.getTime()) fail('First interval must match requested start.');
  if (plan.intervals.at(-1)?.endDate.getTime() !== plan.requestedEndDate.getTime()) fail('Final interval must match requested end.');
  if (plan.intervals.filter((item) => item.isFirst).length !== 1 || plan.intervals.filter((item) => item.isLast).length !== 1) fail('Plan must have one first and one final interval.');
  if (plan.firstInterval.intervalKey !== plan.intervals[0].intervalKey || plan.finalInterval.intervalKey !== plan.intervals.at(-1)?.intervalKey) fail('First/final references are invalid.');
  if (plan.networkRequestsExecuted !== 0 || plan.databaseWritesExecuted !== 0) fail('Dry plan cannot execute network or database writes.');
}

