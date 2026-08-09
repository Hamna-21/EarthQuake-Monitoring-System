import { lazy, Suspense, type ReactNode } from 'react';
import { DashboardPage, DashboardProps } from '../../components/dashboard/types';

const AlertsPage = lazy(() => import('./Alerts/AlertsPage'));
const LiveAnalyticsPage = lazy(() => import('./Analytics/LiveAnalyticsPage'));
const PakistanHistoricalAnalyticsPage = lazy(() => import('./Analytics/PakistanHistoricalAnalyticsPage'));
const DetailsPage = lazy(() => import('./Details/DetailsPage'));
const FeedPage = lazy(() => import('./Feed/FeedPage'));
const HistoricalMapsPage = lazy(() => import('./History/HistoricalMapsPage'));
const HistoryPage = lazy(() => import('./History/HistoryPage'));
const PakistanHistoryPage = lazy(() => import('./History/PakistanHistoryPage'));
const MapPage = lazy(() => import('./Map/MapPage'));
const NearbyPage = lazy(() => import('./Nearby/NearbyPage'));
const OverviewPage = lazy(() => import('./Overview/OverviewPage'));
const PredictionPage = lazy(() => import('./Prediction/PredictionPage'));

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
  else if (page === 'analytics_pakistan') content = <PakistanHistoricalAnalyticsPage {...pageProps} />;
  else if (page === 'prediction') content = <PredictionPage {...pageProps} />;
  else if (page === 'details') content = <DetailsPage {...pageProps} />;
  else if (page === 'nearby') content = <NearbyPage {...pageProps} />;
  else if (page === 'alerts') content = <AlertsPage {...pageProps} />;
  else content = <OverviewPage {...pageProps} searchQuery={search} userName={userName} userEmail={userEmail} />;

  return (
    <Suspense fallback={<div className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 text-sm font-bold text-slate-200 backdrop-blur">Loading dashboard view...</div>}>
      {content}
    </Suspense>
  );
}
