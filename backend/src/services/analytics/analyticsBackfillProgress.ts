import type { AnalyticsBackfillGranularity, AnalyticsBackfillProgressDocument, AnalyticsBackfillRegion } from '../../types/analyticsBackfillProgress';
import { createMonthIntervals, createYearIntervals } from './analyticsIntervals';

export type InitialAnalyticsBackfillInput = {
  region: AnalyticsBackfillRegion;
  startDate: Date;
  endDate: Date;
  minMagnitude: number;
  maxMagnitude: number | null;
  minDepth: number | null;
  maxDepth: number | null;
  granularity: AnalyticsBackfillGranularity;
};

export class AnalyticsBackfillProgressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalyticsBackfillProgressError';
  }
}

const regions = new Set(['pakistan', 'global']);
const granularities = new Set(['year', 'month']);
const statuses = new Set(['pending', 'running', 'paused', 'completed', 'failed']);
const counters = ['totalIntervals', 'completedIntervals', 'fetchedEventCount', 'normalizedEventCount', 'insertedEventCount', 'updatedEventCount', 'skippedEventCount', 'duplicateEventCount'] as const;
const fail = (message: string): never => { throw new AnalyticsBackfillProgressError(message); };
const validDate = (date: Date | null) => date === null || (date instanceof Date && Number.isFinite(date.getTime()));
const copy = (date: Date) => new Date(date.getTime());
const day = (date: Date) => validDate(date) && date ? date.toISOString().slice(0, 10) : fail('Date must be valid.');
const none = (value: number | null) => value === null ? 'none' : String(value);

export function createAnalyticsBackfillJobKey(input: InitialAnalyticsBackfillInput): string {
  return [
    'analytics-backfill:v1', input.region, day(input.startDate), day(input.endDate),
    `minMag=${input.minMagnitude}`, `maxMag=${none(input.maxMagnitude)}`,
    `minDepth=${none(input.minDepth)}`, `maxDepth=${none(input.maxDepth)}`, input.granularity,
  ].join(':');
}

function plannedIntervals(input: InitialAnalyticsBackfillInput) {
  return input.granularity === 'year'
    ? createYearIntervals(input.startDate, input.endDate)
    : createMonthIntervals(input.startDate, input.endDate);
}

export function createInitialBackfillProgress(
  input: InitialAnalyticsBackfillInput,
  now: Date = new Date(),
): AnalyticsBackfillProgressDocument {
  const intervals = plannedIntervals(input);
  const stamp = copy(now);
  const document: AnalyticsBackfillProgressDocument = {
    jobKey: createAnalyticsBackfillJobKey(input), region: input.region,
    startDate: copy(input.startDate), endDate: copy(input.endDate),
    minMagnitude: input.minMagnitude, maxMagnitude: input.maxMagnitude,
    minDepth: input.minDepth, maxDepth: input.maxDepth, granularity: input.granularity,
    intervalPlanVersion: 1, status: 'pending', totalIntervals: intervals.length,
    completedIntervals: 0, nextIntervalStart: intervals[0]?.start ? copy(intervals[0].start) : null,
    lastCompletedIntervalEnd: null, fetchedEventCount: 0, normalizedEventCount: 0,
    insertedEventCount: 0, updatedEventCount: 0, skippedEventCount: 0,
    duplicateEventCount: 0, lastError: null, revision: 0,
    createdAt: copy(stamp), updatedAt: copy(stamp), startedAt: null, completedAt: null,
  };
  validateAnalyticsBackfillProgress(document);
  return document;
}

const finite = (value: number | null, field: string) => {
  if (value !== null && !Number.isFinite(value)) fail(`${field} must be finite when present.`);
};

function validateOptionalDate(date: Date | null, field: string, document: AnalyticsBackfillProgressDocument) {
  if (!validDate(date)) fail(`${field} must be valid when present.`);
  if (date && (date < document.startDate || date > document.endDate)) fail(`${field} must be within the requested date range.`);
}

function validateLastError(document: AnalyticsBackfillProgressDocument) {
  if (document.status === 'failed' && !document.lastError) fail('Failed progress requires lastError.');
  if (!document.lastError) return;
  if (!document.lastError.code.trim() || !document.lastError.message.trim()) fail('lastError requires a safe code and message.');
  if (/\n\s*at\s/.test(document.lastError.message)) fail('lastError.message must not contain stack traces.');
  if (!validDate(document.lastError.occurredAt)) fail('lastError.occurredAt must be valid.');
}

export function validateAnalyticsBackfillProgress(document: AnalyticsBackfillProgressDocument): void {
  if (!document.jobKey.trim()) fail('jobKey is required.');
  if (!regions.has(document.region)) fail('Unsupported backfill region.');
  if (!validDate(document.startDate) || !validDate(document.endDate)) fail('startDate and endDate must be valid.');
  if (document.startDate > document.endDate) fail('startDate cannot be after endDate.');
  finite(document.minMagnitude, 'minMagnitude'); finite(document.maxMagnitude, 'maxMagnitude');
  finite(document.minDepth, 'minDepth'); finite(document.maxDepth, 'maxDepth');
  if (document.minDepth !== null && document.minDepth < 0) fail('minDepth cannot be negative.');
  if (document.maxDepth !== null && document.maxDepth < 0) fail('maxDepth cannot be negative.');
  if (document.maxMagnitude !== null && document.minMagnitude > document.maxMagnitude) fail('Minimum magnitude cannot exceed maximum magnitude.');
  if (document.minDepth !== null && document.maxDepth !== null && document.minDepth > document.maxDepth) fail('Minimum depth cannot exceed maximum depth.');
  if (!granularities.has(document.granularity) || document.intervalPlanVersion !== 1) fail('Invalid interval plan.');
  if (!statuses.has(document.status)) fail('Unsupported backfill status.');
  for (const field of counters) if (!Number.isInteger(document[field]) || document[field] < 0) fail(`${field} must be a non-negative integer.`);
  if (document.completedIntervals > document.totalIntervals) fail('completedIntervals cannot exceed totalIntervals.');
  if (!Number.isInteger(document.revision) || document.revision < 0) fail('revision must be a non-negative integer.');
  validateOptionalDate(document.nextIntervalStart, 'nextIntervalStart', document);
  validateOptionalDate(document.lastCompletedIntervalEnd, 'lastCompletedIntervalEnd', document);
  if (document.status === 'completed' && !document.completedAt) fail('Completed progress requires completedAt.');
  validateLastError(document);
  for (const field of ['createdAt', 'updatedAt', 'startedAt', 'completedAt'] as const) if (!validDate(document[field])) fail(`${field} must be valid when present.`);
  if (document.insertedEventCount + document.updatedEventCount > document.normalizedEventCount) fail('Inserted plus updated events cannot exceed normalized events.');
}

