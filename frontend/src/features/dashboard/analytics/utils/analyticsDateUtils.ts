import type { Earthquake } from '@/types';

export type AnalyticsDateRange = { startDate: string; endDate: string };
export type TimedEarthquake = { event: Earthquake; date: Date };

export const monthShortLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthFullLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parses and formats parse utc date only for the surrounding UI or data flow. */
function parseUtcDateOnly(value: string, endOfDay: boolean) {
  const match = dateOnly.exec(value);
  if (!match) return new Date(value);
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0));
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day)) return new Date(Number.NaN);
  return date;
}

/** Parses and formats parse utc start date for the surrounding UI or data flow. */
export function parseUtcStartDate(value: string) {
  return parseUtcDateOnly(value, false);
}

/** Parses and formats parse utc end date for the surrounding UI or data flow. */
export function parseUtcEndDate(value: string) {
  return parseUtcDateOnly(value, true);
}

/** Checks whether valid date for this frontend flow. */
export function isValidDate(date: Date) {
  return Number.isFinite(date.getTime());
}

/** Parses and formats read date range for the surrounding UI or data flow. */
export function readDateRange(startDate: string, endDate: string) {
  // Parse filter dates as UTC boundaries so browser timezone differences cannot move events between chart periods.
  const start = parseUtcStartDate(startDate);
  const end = parseUtcEndDate(endDate);
  if (!isValidDate(start) || !isValidDate(end)) throw new RangeError('Analytics date range contains an invalid date.');
  // Never swap dates silently; callers should fix invalid filter state.
  if (start.getTime() > end.getTime()) throw new RangeError('Analytics start date must not be after end date.');
  return {
    start,
    end,
    startYear: start.getUTCFullYear(),
    endYear: end.getUTCFullYear(),
    startMonth: start.getUTCMonth() + 1,
    endMonth: end.getUTCMonth() + 1,
  };
}

/** Parses and formats parse event date for the surrounding UI or data flow. */
export function parseEventDate(event: Earthquake) {
  const date = new Date(event.time);
  return isValidDate(date) ? date : null;
}

/** Renders or coordinates events in range for this frontend module. */
export function eventsInRange(events: readonly Earthquake[], startDate: string, endDate: string): TimedEarthquake[] {
  const range = readDateRange(startDate, endDate);
  return events.reduce<TimedEarthquake[]>((items, event) => {
    const date = parseEventDate(event);
    if (date && date.getTime() >= range.start.getTime() && date.getTime() <= range.end.getTime()) items.push({ event, date });
    return items;
  }, []);
}

export const padMonth = (month: number) => String(month).padStart(2, '0');
export const monthKey = (year: number, month: number) => `${year}-${padMonth(month)}`;
export const monthLabel = (year: number, month: number) => `${monthShortLabels[month - 1]} ${year}`;

/** Renders or coordinates for each month for this frontend module. */
export function forEachMonth(startYear: number, startMonth: number, endYear: number, endMonth: number, visit: (year: number, month: number) => void) {
  let year = startYear;
  let month = startMonth;
  while (year < endYear || (year === endYear && month <= endMonth)) {
    visit(year, month);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
}
