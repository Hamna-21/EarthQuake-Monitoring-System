import type { ValidatedAnalyticsQuery } from './analyticsQuery';
import { fetchUsgsAnalyticsCount } from './usgsAnalyticsCountClient';
import { fetchAnalyticsPages } from './analyticsPaginatedFetch';
import type { AnalyticsEarthquake } from './normalizeAnalyticsEarthquake';

const SAFE_COUNT = 16000;
const MIN_SPLIT_MS = 24 * 60 * 60 * 1000;
const MAX_UPSTREAM_REQUESTS = 120;

export class AnalyticsRequestBudgetError extends Error {
  constructor() {
    super('The selected date range is too broad to load efficiently. Please narrow the range.');
    this.name = 'AnalyticsRequestBudgetError';
  }
}

type RequestBudget = { used: number; consume: () => void };

type Result = { events: Map<string, AnalyticsEarthquake>; expected: number; fetched: number; pages: number; chunks: number };

/** Coordinates newest for this module. */
function newest(current: AnalyticsEarthquake | undefined, incoming: AnalyticsEarthquake) {
  if (!current) return incoming;
  const currentTime = current.updatedAt ? Date.parse(current.updatedAt) : -Infinity;
  const incomingTime = incoming.updatedAt ? Date.parse(incoming.updatedAt) : -Infinity;
  return incomingTime > currentTime ? incoming : current;
}

/** Handles the fetch complete analytics query operation and returns its normalized result. */
export async function fetchCompleteAnalyticsQuery(query: ValidatedAnalyticsQuery) {
  const result: Result = { events: new Map(), expected: 0, fetched: 0, pages: 0, chunks: 0 };
  const budget: RequestBudget = { used: 0, consume() { if (++this.used > MAX_UPSTREAM_REQUESTS) throw new AnalyticsRequestBudgetError(); } };
  try {
    await collect(query, result, budget);
  } catch (error) {
    if (error instanceof AnalyticsRequestBudgetError) throw error;
    if (error instanceof Error && /too many matching earthquakes|too many events in one day/i.test(error.message)) throw new AnalyticsRequestBudgetError();
    throw error;
  }
  return { events: [...result.events.values()], expectedCount: result.expected, rawFeatureCount: result.fetched, pages: result.pages, chunks: result.chunks, duplicateCount: result.fetched - result.events.size };
}

// Count first, then recursively split busy ranges so broad searches remain complete without oversized responses.
async function collect(query: ValidatedAnalyticsQuery, result: Result, budget: RequestBudget): Promise<void> {
  budget.consume();
  const count = await fetchUsgsAnalyticsCount(query, { timeoutMs: 20000 });
  if (count.count > SAFE_COUNT) return split(query, result, budget);
  const page = await fetchAnalyticsPages(query, budget, count.count);
  result.expected += count.count; result.fetched += page.rawFeatures; result.pages += page.pages; result.chunks += 1;
  page.events.forEach((event) => result.events.set(event.id, newest(result.events.get(event.id), event)));
}

/** Builds the split result used by the surrounding workflow. */
async function split(query: ValidatedAnalyticsQuery, result: Result, budget: RequestBudget) {
  const start = query.startDate.getTime(), end = query.endDate.getTime();
  if (end - start < MIN_SPLIT_MS) throw new Error('Too many events in one day. Increase the minimum magnitude.');
  const middle = new Date(start + Math.floor((end - start) / 2));
  const rightStart = new Date(middle.getTime() + 1);
  await collect({ ...query, endDate: middle, endDateUtc: middle.toISOString() }, result, budget);
  await collect({ ...query, startDate: rightStart, startDateUtc: rightStart.toISOString() }, result, budget);
}
