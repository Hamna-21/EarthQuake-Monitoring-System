import { Earthquake, SeismicFilters } from '../types';

export function filterAndSortEarthquakes(quakes: Earthquake[], filters: SeismicFilters) {
  let result = quakes.filter((quake) => quake.magnitude >= filters.minMagnitude);
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (filters.timeframe === '24h') result = result.filter((quake) => now - quake.time <= oneDay);
  if (filters.timeframe === '7d') result = result.filter((quake) => now - quake.time <= 7 * oneDay);
  if (filters.timeframe === '30d') result = result.filter((quake) => now - quake.time <= 30 * oneDay);

  if (filters.alertClass === 'yellow') {
    result = result.filter((quake) => ['yellow', 'orange', 'red'].includes(quake.alert ?? '') || quake.magnitude >= 5);
  }
  if (filters.alertClass === 'red') {
    result = result.filter((quake) => quake.alert === 'red' || quake.magnitude >= 6.5);
  }
  if (filters.region.trim()) {
    const search = filters.region.toLowerCase().trim();
    result = result.filter((quake) => quake.place.toLowerCase().includes(search));
  }

  return result.sort((a, b) => b.time - a.time);
}

export function filterHistoricalByQuery(events: Earthquake[], query?: string) {
  if (!query?.trim()) return events;
  const search = query.toLowerCase().trim();
  return events.filter((event) => event.place.toLowerCase().includes(search));
}
