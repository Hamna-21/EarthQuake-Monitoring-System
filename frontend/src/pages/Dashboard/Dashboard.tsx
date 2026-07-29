import React, { useEffect, useMemo, useState } from 'react';
import { Earthquake } from '../../types';
import Shell from '../../components/dashboard/Shell';
import { DashboardPage } from '../../components/dashboard/types';
import { SearchSuggestion } from '../../components/dashboard/DashboardSearch';
import { buildSuggestions, readRecentSearches, syncSearchParam, writeRecentSearches } from './dashboardSearchUtils';
import DashboardPageSwitch from './DashboardPageSwitch';

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
  const openSuggestion = (item: SearchSuggestion) => {
    remember(globalSearch || item.label);
    if (item.id.startsWith('page:')) return setPage(item.id.replace('page:', '') as DashboardPage);
    if (item.id.startsWith('quake:')) { setSelectedHistoryEvent(null); setSelectedId(item.id.replace('quake:', '')); return setPage('details'); }
    setGlobalSearch(item.label);
    setPage('map');
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
    selectedEvent,
    setSelectedId: selectLiveEvent,
    setSelectedEvent: setSelectedHistoryEvent,
    openPage: setPage,
    globalSearch,
    highlightedEventId: selectedId
  };

  return (
    <Shell
      page={page}
      setPage={setPage}
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
      <DashboardPageSwitch page={page} pageProps={pageProps} userName={props.userName} userEmail={props.userEmail} search={globalSearch} />
    </Shell>
  );
}



