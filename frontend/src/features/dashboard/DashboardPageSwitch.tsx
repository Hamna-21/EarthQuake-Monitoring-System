import { lazy, Suspense, type ReactNode } from 'react';
import { DashboardPage, DashboardProps } from '@/features/dashboard/types';

const OverviewPage = lazy(() => import('@/features/dashboard/pages/Overview/Overview'));
const AlertsPage = lazy(() => import('@/features/dashboard/pages/Alerts/Alerts'));
const LiveAnalyticsPage = lazy(() => import('@/features/dashboard/pages/Analytics/Analytics'));
const HistoricalAnalyticsPage = lazy(() => import('@/features/dashboard/pages/HistoricalAnalytics/HistoricalAnalytics'));
const DetailsPage = lazy(() => import('@/features/dashboard/pages/Details/Details'));
const FeedPage = lazy(() => import('@/features/dashboard/pages/Feed/Feed'));
const HistoricalMapsPage = lazy(() => import('@/features/dashboard/pages/HistoricalMap/HistoricalMap'));
const HistoryPage = lazy(() => import('@/features/dashboard/pages/Historical/Historical'));
const PakistanHistoryPage = lazy(() => import('@/features/dashboard/pages/PakistanHistory/PakistanHistory'));
const MapPage = lazy(() => import('@/features/dashboard/pages/GlobalMap/GlobalMap'));
const NearbyPage = lazy(() => import('@/features/dashboard/pages/Nearby/Nearby'));
const PredictionPage = lazy(() => import('@/features/dashboard/pages/Prediction/Prediction'));

type Props = {
  page: DashboardPage;
  pageProps: DashboardProps;
  userName: string | null;
  userEmail: string | null;
  search: string;
};

export default function DashboardPageSwitch({ page, pageProps, userName, userEmail, search }: Props) {
  let content: ReactNode;
  if (page === 'overview') content = <OverviewPage {...pageProps} searchQuery={search} userName={userName} userEmail={userEmail} />;
  else if (page === 'feed') content = <FeedPage {...pageProps} />;
  else if (page === 'map') content = <MapPage {...pageProps} />;
  else if (page === 'historical_maps') content = <HistoricalMapsPage {...pageProps} />;
  else if (page === 'history') content = <HistoryPage {...pageProps} />;
  else if (page === 'pakistan_history') content = <PakistanHistoryPage {...pageProps} />;
  else if (page === 'analytics') content = <LiveAnalyticsPage {...pageProps} />;
  else if (page === 'analytics_global') content = <HistoricalAnalyticsPage {...pageProps} />;
  else if (page === 'prediction') content = <PredictionPage {...pageProps} />;
  else if (page === 'details') content = <DetailsPage {...pageProps} />;
  else if (page === 'nearby') content = <NearbyPage {...pageProps} />;
  else if (page === 'alerts') content = <AlertsPage {...pageProps} />;
  else content = <OverviewPage {...pageProps} searchQuery={search} userName={userName} userEmail={userEmail} />;

  return <Suspense fallback={null}>{content}</Suspense>;
}
