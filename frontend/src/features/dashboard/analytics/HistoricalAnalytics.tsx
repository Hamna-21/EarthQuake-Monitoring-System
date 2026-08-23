import type { DashboardProps } from '@/features/dashboard/types';
import { HistoricalAnalyticsPanel } from '@/features/dashboard/analytics/GlobalHistoricalAnalytics';
import './HistoricalAnalytics.css';

/** Renders or coordinates historical analytics page for this frontend module. */
export default function HistoricalAnalyticsPage(props: DashboardProps) {
  return <div className="historical-analytics-page"><HistoricalAnalyticsPanel {...props} /></div>;
}
/** Coordinates historical analytics filters, requests, charts, and export state. */
