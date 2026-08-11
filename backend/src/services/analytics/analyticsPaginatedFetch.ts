import type { ValidatedAnalyticsQuery } from './analyticsQuery';
import type { AnalyticsEarthquake } from './normalizeAnalyticsEarthquake';
import { fetchAnalyticsInterval } from './usgsAnalyticsClient';

const PAGE_SIZE = 1000;
const MAX_PAGES = 20;

export async function fetchAnalyticsPages(query: ValidatedAnalyticsQuery) {
  const events = new Map<string, AnalyticsEarthquake>();
  let page = 0, rawFeatures = 0;
  while (page < MAX_PAGES) {
    const response = await fetchAnalyticsInterval({ ...query, limit: PAGE_SIZE, offset: page * PAGE_SIZE + 1 }, { timeoutMs: 20000, allowPartial: true });
    rawFeatures += response.returnedFeatureCount;
    response.events.forEach((event) => events.set(event.id, event));
    page += 1;
    if (response.returnedFeatureCount < PAGE_SIZE) break;
  }
  if (page === MAX_PAGES) throw new Error('Too many matching earthquakes. Narrow the year range or increase the minimum magnitude.');
  return { events: [...events.values()], pages: page, rawFeatures, duplicateCount: rawFeatures - events.size };
}
