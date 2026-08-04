import type { ValidatedAnalyticsQuery } from './analyticsQuery';

export type AnalyticsGranularity = 'year' | 'month';

export type AnalyticsInterval = {
  start: Date;
  end: Date;
  label: string;
  granularity: AnalyticsGranularity;
};

const copy = (date: Date) => new Date(date);

function label(date: Date, granularity: AnalyticsGranularity) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return granularity === 'year' ? String(year) : `${year}-${month}`;
}

function nextBoundary(date: Date, granularity: AnalyticsGranularity) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  if (granularity === 'year') return new Date(Date.UTC(year + 1, 0, 1));
  return new Date(Date.UTC(year, month + 1, 1));
}

function createIntervals(startDate: Date, endDate: Date, granularity: AnalyticsGranularity) {
  const intervals: AnalyticsInterval[] = [];
  let cursor = copy(startDate);
  const endTime = endDate.getTime();
  while (cursor.getTime() < endTime) {
    const boundary = nextBoundary(cursor, granularity);
    const intervalEnd = boundary.getTime() < endTime ? boundary : copy(endDate);
    intervals.push({ start: copy(cursor), end: copy(intervalEnd), label: label(cursor, granularity), granularity });
    cursor = copy(intervalEnd);
  }
  return intervals;
}

export function createYearIntervals(startDate: Date, endDate: Date) {
  return createIntervals(startDate, endDate, 'year');
}

export function createMonthIntervals(startDate: Date, endDate: Date) {
  return createIntervals(startDate, endDate, 'month');
}

export function planAnalyticsIntervals(query: ValidatedAnalyticsQuery, granularity: AnalyticsGranularity = 'year') {
  return granularity === 'year'
    ? createYearIntervals(query.startDate, query.endDate)
    : createMonthIntervals(query.startDate, query.endDate);
}

