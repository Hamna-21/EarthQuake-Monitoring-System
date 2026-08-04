import { Earthquake } from '../../types';
import { countryOf, fmtDate } from '../../components/dashboard/data';
import { SearchSuggestion } from '../../components/dashboard/DashboardSearch';

export const dashboardPages = [
  ['overview', 'Overview', 'Dashboard overview and key statistics'],
  ['feed', 'Live Feed', 'Real-time earthquake records'],
  ['map', 'Global Map', 'Earthquake map and markers'],
  ['history', 'Historical', 'Historical earthquake explorer'],
  ['pakistan_history', 'Pakistan Seismic History', 'Verified earthquakes inside Pakistan'],
  ['analytics', 'Live Analytics', 'Live charts and seismic insights'],
  ['analytics_pakistan', 'Pakistan Historical Analytics', 'Pakistan historical seismic charts'],
  ['details', 'Details', 'Selected earthquake report'],
  ['nearby', 'Nearby', 'Earthquakes around your location'],
  ['alerts', 'Alerts', 'Monitoring rules and matches'],
] as const;

export const recentSearchKey = 'geopulse-dashboard-searches';

export const readRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem(recentSearchKey) || '[]') as string[];
  } catch {
    return [];
  }
};

export const writeRecentSearches = (items: string[]) => {
  localStorage.setItem(recentSearchKey, JSON.stringify(items));
};

export const earthquakeSearchText = (event: Earthquake) =>
  [
    event.place,
    countryOf(event.place),
    event.id,
    event.magnitude.toFixed(1),
    event.alert ?? 'no alert',
    event.status,
    fmtDate(event.time, 'UTC'),
  ].join(' ').toLowerCase();

export const buildSuggestions = (earthquakes: Earthquake[], query: string, recentSearches: string[]): SearchSuggestion[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const pageHits = dashboardPages.filter(([, label, detail]) => `${label} ${detail}`.toLowerCase().includes(q))
    .map(([id, label, detail]) => ({ id: `page:${id}`, group: 'Pages' as const, label, detail }));
  const quakeHits = earthquakes.filter((event) => earthquakeSearchText(event).includes(q)).slice(0, 6)
    .map((event) => ({ id: `quake:${event.id}`, group: 'Earthquakes' as const, label: event.place, detail: `M ${event.magnitude.toFixed(1)} • ${countryOf(event.place)} • ${event.id}` }));
  const locations = [...new Set(earthquakes.map((event) => countryOf(event.place)).filter((item) => item !== 'Not listed' && item.toLowerCase().includes(q)))].slice(0, 4)
    .map((label) => ({ id: `location:${label}`, group: 'Locations' as const, label, detail: 'Open matching earthquakes on the map' }));
  const recents = recentSearches.filter((item) => item.toLowerCase().includes(q) && item.toLowerCase() !== q).slice(0, 3)
    .map((label) => ({ id: `recent:${label}`, group: 'Recent searches' as const, label, detail: 'Search again' }));
  return [...pageHits, ...quakeHits, ...locations, ...recents];
};

export const syncSearchParam = (value: string) => {
  const params = new URLSearchParams(window.location.search);
  if (value.trim()) params.set('search', value.trim());
  else params.delete('search');
  window.history.replaceState(null, '', `${window.location.pathname}${params.toString() ? `?${params}` : ''}`);
};
