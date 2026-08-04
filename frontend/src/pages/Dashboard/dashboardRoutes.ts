import type { DashboardPage } from '../../components/dashboard/types';

const routeByPage: Record<DashboardPage, string> = {
  overview: '/dashboard/overview',
  feed: '/dashboard/feed',
  map: '/dashboard/map',
  history: '/dashboard/history',
  pakistan_history: '/dashboard/pakistan-seismic-history',
  analytics: '/dashboard/analytics/live',
  analytics_pakistan: '/dashboard/analytics/pakistan-historical',
  details: '/dashboard/details',
  nearby: '/dashboard/nearby',
  alerts: '/dashboard/alerts',
  ai_assistant: '/dashboard/ai-assistant',
};

export const pathForPage = (page: DashboardPage) => routeByPage[page];

export function pageFromPath(path: string): DashboardPage {
  if (path === '/dashboard/analytics/pakistan-historical') return 'analytics_pakistan';
  if (path === '/dashboard/analytics' || path === '/dashboard/analytics/live') return 'analytics';
  return Object.entries(routeByPage).find(([, route]) => route === path)?.[0] as DashboardPage || 'overview';
}

export function normalizeDashboardPath() {
  if (window.location.pathname === '/dashboard/analytics') {
    window.history.replaceState(null, '', `${routeByPage.analytics}${window.location.search}`);
  }
}
