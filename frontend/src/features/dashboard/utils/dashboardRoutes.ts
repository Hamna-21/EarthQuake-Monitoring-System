import type { DashboardPage } from '@/features/dashboard/types';

const routeByPage: Record<DashboardPage, string> = {
  overview: '/dashboard/overview',
  feed: '/dashboard/feed',
  map: '/dashboard/map',
  historical_maps: '/dashboard/historical-maps',
  history: '/dashboard/history',
  pakistan_history: '/dashboard/pakistan-seismic-history',
  analytics: '/dashboard/analytics/live',
  analytics_global: '/dashboard/analytics/historical',
  prediction: '/dashboard/prediction',
  details: '/dashboard/details',
  nearby: '/dashboard/nearby',
  alerts: '/dashboard/alerts',
};

// Keep page identifiers and browser paths in one source of truth for sidebar navigation and deep links.
export const pathForPage = (page: DashboardPage) => routeByPage[page];

/** Renders or coordinates page from path for this frontend module. */
export function pageFromPath(path: string): DashboardPage {
  if (path === '/dashboard/history' || path === '/dashboard/pakistan-seismic-history') return 'historical_maps';
  if (path === '/dashboard/analytics/historical' || path === '/dashboard/analytics/pakistan-historical') return 'analytics_global';
  if (path === '/dashboard/analytics' || path === '/dashboard/analytics/live') return 'analytics';
  return Object.entries(routeByPage).find(([, route]) => route === path)?.[0] as DashboardPage || 'overview';
}

/** Parses and formats normalize dashboard path for the surrounding UI or data flow. */
export function normalizeDashboardPath() {
  if (window.location.pathname === '/dashboard/analytics') {
    window.history.replaceState(null, '', `${routeByPage.analytics}${window.location.search}`);
  }
}
