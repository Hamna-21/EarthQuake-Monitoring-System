import type { ValidatedAnalyticsQuery } from './analyticsQuery';
import type { AnalyticsEarthquake } from './normalizeAnalyticsEarthquake';
import { fetchAnalyticsInterval } from './usgsAnalyticsClient';

const PAGE_SIZE = 1000;
const MAX_PAGES = 20;
const PAGE_CONCURRENCY = 4;

function newest(current: AnalyticsEarthquake | undefined, incoming: AnalyticsEarthquake) {
  if (!current) return incoming;
  const currentTime = current.updatedAt ? Date.parse(current.updatedAt) : -Infinity;
  const incomingTime = incoming.updatedAt ? Date.parse(incoming.updatedAt) : -Infinity;
  return incomingTime > currentTime ? incoming : current;
}

type RequestBudget = { consume: () => void };

export async function fetchAnalyticsPages(query: ValidatedAnalyticsQuery, budget?: RequestBudget, expectedCount?: number) {
  const events = new Map<string, AnalyticsEarthquake>();
  let page = 0, rawFeatures = 0;
  const totalPages = Number.isFinite(expectedCount) ? Math.ceil((expectedCount as number) / PAGE_SIZE) : null;
  if (totalPages !== null && totalPages > MAX_PAGES) throw new Error('Too many matching earthquakes. Narrow the year range or increase the minimum magnitude.');
  const fetchPage = async (pageIndex: number) => {
    budget?.consume();
    return fetchAnalyticsInterval({ ...query, limit: PAGE_SIZE, offset: pageIndex * PAGE_SIZE + 1 }, { timeoutMs: 20000, allowPartial: true });
  };
  if (totalPages !== null) {
    while (page < totalPages) {
      const indexes = Array.from({ length: Math.min(PAGE_CONCURRENCY, totalPages - page) }, (_, index) => page + index);
      const responses = await Promise.all(indexes.map(fetchPage));
      responses.forEach((response) => {
        rawFeatures += response.returnedFeatureCount;
        response.events.forEach((event) => events.set(event.id, newest(events.get(event.id), event)));
      });
      page += responses.length;
    }
  } else {
    while (page < MAX_PAGES) {
      const response = await fetchPage(page);
      rawFeatures += response.returnedFeatureCount;
      response.events.forEach((event) => events.set(event.id, newest(events.get(event.id), event)));
      page += 1;
      if (response.returnedFeatureCount < PAGE_SIZE) break;
    }
  }
  if (page === MAX_PAGES) throw new Error('Too many matching earthquakes. Narrow the year range or increase the minimum magnitude.');
  return { events: [...events.values()], pages: page, rawFeatures, duplicateCount: rawFeatures - events.size };
}
