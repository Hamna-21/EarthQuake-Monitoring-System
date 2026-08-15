import type { DashboardProps } from '@/features/dashboard/types';
import { HistoricalAnalyticsPanel } from '@/features/dashboard/analytics/GlobalHistoricalAnalytics';
import './HistoricalAnalytics.css';

export default function HistoricalAnalyticsPage(props: DashboardProps) {
  return <div className="historical-analytics-page"><HistoricalAnalyticsPanel {...props} /></div>;
}
