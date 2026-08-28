import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Earthquake } from '@/types';
import Shell from '@/layouts/DashboardLayout';
import { DashboardPage } from '@/features/dashboard/types';
import { SearchSuggestion } from '@/features/dashboard/components/DashboardSearch';
import { buildSuggestions, readRecentSearches, syncSearchParam, writeRecentSearches } from '@/features/dashboard/utils/dashboardSearchUtils';
import DashboardPageSwitch from '@/features/dashboard/DashboardPageSwitch';
import { normalizeDashboardPath, pageFromPath, pathForPage } from '@/features/dashboard/utils/dashboardRoutes';
import { DashboardStateProvider } from '@/features/dashboard/hooks/DashboardStateContext';
const WarningHub = lazy(() => import('@/features/dashboard/safety/Safety'));

interface UserDashboardProps {
  userEmail: string | null;
  userName: string | null;
  onLogout: () => void;
  earthquakes: Earthquake[];
  onOpenWarningHub: () => void;
  isWarningHubOpen: boolean;
  onCloseWarningHub: () => void;
  isLoading: boolean;
  dataError: string | null;
  lastUpdated: number | null;
  onRefresh: () => void;
}

// Keep route state, global search suggestions, and the selected live/history event in one dashboard boundary.
export default function Dashboard(props: UserDashboardProps) {
  const [page, setPage] = useState<DashboardPage>(() => {
    normalizeDashboardPath();
    return pageFromPath(window.location.pathname);
  });
  const [globalSearch, setGlobalSearch] = useState(() => new URLSearchParams(window.location.search).get('search') ?? '');
  const [recentSearches, setRecentSearches] = useState<string[]>(readRecentSearches);
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
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    return buildSuggestions(props.earthquakes, globalSearch, recentSearches);
  }, [props.earthquakes, globalSearch, recentSearches]);
  const remember = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    const next = [clean, ...recentSearches.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    setRecentSearches(next);
    writeRecentSearches(next);
  };
  const openPage = (next: DashboardPage) => {
    setPage(next);
    window.history.pushState(null, '', `${pathForPage(next)}${window.location.search}`);
  };
  useEffect(() => {
    const onPop = () => setPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  // Search suggestions either navigate to a page or select an earthquake before opening its details view.
  const openSuggestion = (item: SearchSuggestion) => {
    remember(globalSearch || item.label);
    if (item.id.startsWith('page:')) return openPage(item.id.replace('page:', '') as DashboardPage);
    if (item.id.startsWith('quake:')) { setSelectedHistoryEvent(null); setSelectedId(item.id.replace('quake:', '')); return openPage('details'); }
    setGlobalSearch(item.label);
    openPage('map');
  };
  const submitSearch = () => {
    remember(globalSearch);
    if (suggestions[0]) openSuggestion(suggestions[0]);
  };
  useEffect(() => {
    syncSearchParam(globalSearch);
  }, [globalSearch]);
  const pageProps = {
    earthquakes: props.earthquakes,
    isLoading: props.isLoading,
    dataError: props.dataError,
    lastUpdated: props.lastUpdated,
    selectedEvent,
    setSelectedId: selectLiveEvent,
    setSelectedEvent: setSelectedHistoryEvent,
    openPage,
    onBack: () => openPage('overview'),
    globalSearch,
    highlightedEventId: selectedId
  };

  return (
    <>
    <Shell
      page={page}
      setPage={openPage}
      userEmail={props.userEmail}
      userName={props.userName}
      onLogout={props.onLogout}
      onOpenWarningHub={props.onOpenWarningHub}
      searchValue={globalSearch}
      suggestions={suggestions}
      onSearchChange={setGlobalSearch}
      onSearchClear={() => setGlobalSearch('')}
      onSearchOpen={openSuggestion}
      onSearchSubmit={submitSearch}
    >
      <div className="mb-5 flex justify-end">
        <button onClick={props.onRefresh} className="cursor-pointer rounded-2xl border border-cyan-300/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-white/15">
          Refresh Data
        </button>
      </div>
      <DashboardStateProvider><DashboardPageSwitch page={page} pageProps={pageProps} userName={props.userName} userEmail={props.userEmail} search={globalSearch} /></DashboardStateProvider>
    </Shell>
    {props.isWarningHubOpen && <Suspense fallback={null}><WarningHub isOpen onClose={props.onCloseWarningHub} /></Suspense>}
    </>
  );
}



