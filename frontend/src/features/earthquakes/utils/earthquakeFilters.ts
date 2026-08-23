import type { Earthquake, SeismicFilters } from '@/types';

const eventTimeMs = (time: string) => {
  const value = Date.parse(time);
  return Number.isFinite(value) ? value : 0;
};

// Apply magnitude, time-window, alert, tsunami, and text filters before newest-first sorting.
export function filterAndSortEarthquakes(quakes: Earthquake[], filters: SeismicFilters) {
  let result = quakes.filter((quake) => quake.magnitude >= filters.minMagnitude);
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (filters.timeframe === '24h') result = result.filter((quake) => now - eventTimeMs(quake.time) <= oneDay);
  if (filters.timeframe === '7d') result = result.filter((quake) => now - eventTimeMs(quake.time) <= 7 * oneDay);
  if (filters.timeframe === '30d') result = result.filter((quake) => now - eventTimeMs(quake.time) <= 30 * oneDay);

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

  return result.sort((a, b) => eventTimeMs(b.time) - eventTimeMs(a.time));
}

/** Builds the filter historical by query result used by the surrounding component. */
export function filterHistoricalByQuery(events: Earthquake[], query?: string) {
  if (!query?.trim()) return events;
  const search = query.toLowerCase().trim();
  return events.filter((event) => event.place.toLowerCase().includes(search));
}

/** Builds the filter pakistan events result used by the surrounding component. */
export function filterPakistanEvents(events: Earthquake[]) {
  const outside = /afghanistan|tajikistan|india|iran|china|kyrgyzstan|jurm|bazarak/i;
  return events.filter((event) => {
    const inBox = event.latitude >= 23.5 && event.latitude <= 37.5 && event.longitude >= 60 && event.longitude <= 78.5;
    return inBox && !outside.test(event.place);
  });
}
