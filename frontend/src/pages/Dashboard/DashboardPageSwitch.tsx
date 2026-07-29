import { DashboardPage, DashboardProps } from '../../components/dashboard/types';
import AiAssistantPage from './AiAssistant/AiAssistantPage';
import AlertsPage from './Alerts/AlertsPage';
import AnalyticsPage from './Analytics/AnalyticsPage';
import DetailsPage from './Details/DetailsPage';
import FeedPage from './Feed/FeedPage';
import HistoryPage from './History/HistoryPage';
import MapPage from './Map/MapPage';
import NearbyPage from './Nearby/NearbyPage';
import OverviewPage from './Overview/OverviewPage';

type Props = {
  page: DashboardPage;
  pageProps: DashboardProps;
  userName: string | null;
  userEmail: string | null;
  search: string;
};

export default function DashboardPageSwitch({ page, pageProps, userName, userEmail, search }: Props) {
  if (page === 'overview') return <OverviewPage {...pageProps} searchQuery={search} />;
  if (page === 'feed') return <FeedPage {...pageProps} />;
  if (page === 'map') return <MapPage {...pageProps} />;
  if (page === 'history') return <HistoryPage {...pageProps} />;
  if (page === 'analytics') return <AnalyticsPage {...pageProps} />;
  if (page === 'details') return <DetailsPage {...pageProps} />;
  if (page === 'nearby') return <NearbyPage {...pageProps} />;
  if (page === 'alerts') return <AlertsPage {...pageProps} />;
  return <AiAssistantPage {...pageProps} userName={userName} userEmail={userEmail} />;
}
