export type AnalyticsRegion = 'pakistan' | 'global';

export type AnalyticsQueryInput = Record<string, unknown>;

export type ValidatedAnalyticsQuery = {
  startDate: Date;
  endDate: Date;
  startDateUtc: string;
  endDateUtc: string;
  region: AnalyticsRegion;
  minMagnitude: number;
  maxMagnitude: number | null;
  minDepth: number | null;
  maxDepth: number | null;
};

export const ANALYTICS_START_DATE = '1975-01-01';
export const DEFAULT_ANALYTICS_MIN_MAGNITUDE = 4;

export class AnalyticsValidationError extends Error {
  constructor(message: string, public code = 'invalid_analytics_query') {
    super(message);
    this.name = 'AnalyticsValidationError';
  }
}

export const createDefaultAnalyticsEndDate = (now = new Date()) => new Date(now);

const dateOnly = /^\d{4}-\d{2}-\d{2}$/;

function fail(message: string, code?: string): never {
  throw new AnalyticsValidationError(message, code);
}

function parseDate(value: unknown, boundary: 'start' | 'end') {
  if (value instanceof Date) return new Date(value);
  if (typeof value !== 'string' || !value.trim()) fail('Date must be a valid YYYY-MM-DD or ISO value.', 'invalid_date');
  const text = value.trim();
  if (!dateOnly.test(text)) {
    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) fail('Date must be a valid YYYY-MM-DD or ISO value.', 'invalid_date');
    return parsed;
  }
  const [year, month, day] = text.split('-').map(Number);
  const parsed = boundary === 'end'
    ? new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
    : new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  if (parsed.toISOString().slice(0, 10) !== text) fail('Date must be a real calendar date.', 'invalid_date');
  return parsed;
}

function readNumber(input: AnalyticsQueryInput, key: string, fallback: number | null) {
  const raw = input[key];
  if (raw === undefined || raw === null || raw === '') return fallback;
  if (typeof raw === 'object') fail(`${key} must be a number.`, 'invalid_number');
  const value = Number(raw);
  if (!Number.isFinite(value)) fail(`${key} must be a finite number.`, 'invalid_number');
  return value;
}

function readRegion(input: AnalyticsQueryInput): AnalyticsRegion {
  const region = String(input.region ?? input.mode ?? 'pakistan').trim().toLowerCase();
  if (region === 'pakistan' || region === 'global') return region;
  fail('Region must be either pakistan or global.', 'invalid_region');
}

function utcDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function validateAnalyticsQuery(input: AnalyticsQueryInput = {}, now = new Date()): ValidatedAnalyticsQuery {
  const safeNow = Number.isFinite(now.getTime()) ? new Date(now) : new Date();
  const startDate = parseDate(input.startDate ?? input.start ?? ANALYTICS_START_DATE, 'start');
  let endDate = parseDate(input.endDate ?? input.end ?? safeNow, 'end');
  if (startDate.getTime() < Date.UTC(1975, 0, 1)) fail('Start date cannot be earlier than 1975-01-01.', 'start_date_too_old');
  if (endDate.getTime() > safeNow.getTime()) {
    if (utcDay(endDate) !== utcDay(safeNow)) fail('End date cannot be in the future.', 'end_date_future');
    endDate = new Date(safeNow);
  }
  if (startDate.getTime() > endDate.getTime()) fail('Start date cannot be later than end date.', 'date_range_invalid');
  const minMagnitude = readNumber(input, 'minMagnitude', DEFAULT_ANALYTICS_MIN_MAGNITUDE) as number;
  const maxMagnitude = readNumber(input, 'maxMagnitude', null);
  const minDepth = readNumber(input, 'minDepth', null);
  const maxDepth = readNumber(input, 'maxDepth', null);
  if (minDepth !== null && minDepth < 0) fail('Minimum depth cannot be negative.', 'depth_range_invalid');
  if (maxDepth !== null && maxDepth < 0) fail('Maximum depth cannot be negative.', 'depth_range_invalid');
  if (maxMagnitude !== null && minMagnitude > maxMagnitude) fail('Minimum magnitude cannot exceed maximum magnitude.', 'magnitude_range_invalid');
  if (minDepth !== null && maxDepth !== null && minDepth > maxDepth) fail('Minimum depth cannot exceed maximum depth.', 'depth_range_invalid');
  return { startDate, endDate, startDateUtc: startDate.toISOString(), endDateUtc: endDate.toISOString(), region: readRegion(input), minMagnitude, maxMagnitude, minDepth, maxDepth };
}
