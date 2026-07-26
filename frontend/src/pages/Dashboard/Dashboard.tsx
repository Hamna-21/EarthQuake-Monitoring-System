import React, { useMemo, useState } from 'react';
import { Earthquake } from '../../types';
import Shell from '../../components/dashboard/Shell';
import { DashboardPage } from '../../components/dashboard/types';
import OverviewPage from './Overview/OverviewPage';
import FeedPage from './Feed/FeedPage';
import MapPage from './Map/MapPage';
import HistoryPage from './History/HistoryPage';
import AnalyticsPage from './Analytics/AnalyticsPage';
import DetailsPage from './Details/DetailsPage';
import NearbyPage from './Nearby/NearbyPage';
import AlertsPage from './Alerts/AlertsPage';
import AiAssistantPage from './AiAssistant/AiAssistantPage';

interface UserDashboardProps {
  userEmail: string | null;
  userName: string | null;
  onLogout: () => void;
  earthquakes: Earthquake[];
  onOpenWarningHub: () => void;
  isLoading: boolean;
  dataError: string | null;
  onRefresh: () => void;
}

export default function Dashboard(props: UserDashboardProps) {
  const [page, setPage] = useState<DashboardPage>('overview');
  const [selectedId, setSelectedId] = useState<string | null>(props.earthquakes[0]?.id ?? null);
  const [selectedHistoryEvent, setSelectedHistoryEvent] = useState<Earthquake | null>(null);
  const selectLiveEvent = (id: string | null) => {
    setSelectedHistoryEvent(null);
    setSelectedId(id);
  };
  const selectedEvent = useMemo(
    () =>
      selectedHistoryEvent ??
      props.earthquakes.find((event) => event.id === selectedId) ??
      props.earthquakes[0] ??
      null,
    [props.earthquakes, selectedHistoryEvent, selectedId]
  );
  const pageProps = {
    earthquakes: props.earthquakes,
    isLoading: props.isLoading,
    dataError: props.dataError,
    selectedEvent,
    setSelectedId: selectLiveEvent,
    setSelectedEvent: setSelectedHistoryEvent,
    openPage: setPage
  };

  return (
    <Shell
      page={page}
      setPage={setPage}
      userEmail={props.userEmail}
      userName={props.userName}
      onLogout={props.onLogout}
      onOpenWarningHub={props.onOpenWarningHub}
    >
      <div className="mb-5 flex justify-end">
        <button onClick={props.onRefresh} className="cursor-pointer rounded-2xl border border-cyan-300/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-white/15">
          Refresh Data
        </button>
      </div>
      {page === 'overview' && <OverviewPage {...pageProps} />}
      {page === 'feed' && <FeedPage {...pageProps} />}
      {page === 'map' && <MapPage {...pageProps} />}
      {page === 'history' && <HistoryPage {...pageProps} />}
      {page === 'analytics' && <AnalyticsPage {...pageProps} />}
      {page === 'details' && <DetailsPage {...pageProps} />}
      {page === 'nearby' && <NearbyPage {...pageProps} />}
      {page === 'alerts' && <AlertsPage {...pageProps} />}
      {page === 'ai_assistant' && <AiAssistantPage {...pageProps} userName={props.userName} userEmail={props.userEmail} />}
    </Shell>
  );
}



