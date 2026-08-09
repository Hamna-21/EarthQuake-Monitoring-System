import type { DashboardPage } from '../../components/dashboard/types';

const routeByPage: Record<DashboardPage, string> = {
  overview: '/dashboard/overview',
  feed: '/dashboard/feed',
  map: '/dashboard/map',
  historical_maps: '/dashboard/historical-maps',
  history: '/dashboard/history',
  pakistan_history: '/dashboard/pakistan-seismic-history',
  analytics: '/dashboard/analytics/live',
  analytics_pakistan: '/dashboard/analytics/pakistan-historical',
  prediction: '/dashboard/prediction',
  details: '/dashboard/details',
  nearby: '/dashboard/nearby',
  alerts: '/dashboard/alerts',
};

export const pathForPage = (page: DashboardPage) => routeByPage[page];

export function pageFromPath(path: string): DashboardPage {
  if (path === '/dashboard/history' || path === '/dashboard/pakistan-seismic-history') return 'historical_maps';
  if (path === '/dashboard/analytics/pakistan-historical') return 'analytics_pakistan';
  if (path === '/dashboard/analytics' || path === '/dashboard/analytics/live') return 'analytics';
  return Object.entries(routeByPage).find(([, route]) => route === path)?.[0] as DashboardPage || 'overview';
}

export function normalizeDashboardPath() {
  if (window.location.pathname === '/dashboard/analytics') {
    window.history.replaceState(null, '', `${routeByPage.analytics}${window.location.search}`);
  }
}
