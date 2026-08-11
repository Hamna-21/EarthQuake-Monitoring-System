import type { ValidatedAnalyticsQuery } from './analyticsQuery';
import { fetchUsgsAnalyticsCount } from './usgsAnalyticsCountClient';
import { fetchAnalyticsPages } from './analyticsPaginatedFetch';
import type { AnalyticsEarthquake } from './normalizeAnalyticsEarthquake';

const SAFE_COUNT = 16000;
const MIN_SPLIT_MS = 24 * 60 * 60 * 1000;

type Result = { events: Map<string, AnalyticsEarthquake>; expected: number; fetched: number; pages: number; chunks: number };

export async function fetchCompleteAnalyticsQuery(query: ValidatedAnalyticsQuery) {
  const result: Result = { events: new Map(), expected: 0, fetched: 0, pages: 0, chunks: 0 };
  await collect(query, result);
  return { events: [...result.events.values()], expectedCount: result.expected, rawFeatureCount: result.fetched, pages: result.pages, chunks: result.chunks, duplicateCount: result.fetched - result.events.size };
}

async function collect(query: ValidatedAnalyticsQuery, result: Result): Promise<void> {
  const count = await fetchUsgsAnalyticsCount(query, { timeoutMs: 20000 });
  if (count.count > SAFE_COUNT) return split(query, result);
  const page = await fetchAnalyticsPages(query);
  result.expected += count.count; result.fetched += page.rawFeatures; result.pages += page.pages; result.chunks += 1;
  page.events.forEach((event) => result.events.set(event.id, event));
}

async function split(query: ValidatedAnalyticsQuery, result: Result) {
  const start = query.startDate.getTime(), end = query.endDate.getTime();
  if (end - start < MIN_SPLIT_MS) throw new Error('Too many events in one day. Increase the minimum magnitude.');
  const middle = new Date(start + Math.floor((end - start) / 2));
  const rightStart = new Date(middle.getTime() + 1);
  await collect({ ...query, endDate: middle, endDateUtc: middle.toISOString() }, result);
  await collect({ ...query, startDate: rightStart, startDateUtc: rightStart.toISOString() }, result);
}
