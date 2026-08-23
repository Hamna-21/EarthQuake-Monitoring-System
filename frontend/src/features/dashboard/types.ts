import { Earthquake } from '@/types';

export type DashboardPage =
  | 'overview'
  | 'feed'
  | 'map'
  | 'historical_maps'
  | 'history'
  | 'pakistan_history'
  | 'analytics'
  | 'analytics_global'
  | 'prediction'
  | 'details'
  | 'nearby'
  | 'alerts';

export type SortKey = 'time' | 'magnitude' | 'depth' | 'place' | 'alert' | 'status';
export type SortDirection = 'asc' | 'desc';

export type EventFilters = {
  query: string;
  minMag: number;
  maxMag: number;
  minDepth: number;
  maxDepth: number;
  alert: string;
  tsunami: string;
  status: string;
};

export type SortState = {
  key: SortKey;
  direction: SortDirection;
};

export type DashboardProps = {
  earthquakes: Earthquake[];
  isLoading: boolean;
  dataError: string | null;
  lastUpdated?: number | null;
  selectedEvent: Earthquake | null;
  setSelectedId: (id: string | null) => void;
  setSelectedEvent?: (event: Earthquake | null) => void;
  openPage: (page: DashboardPage) => void;
  globalSearch?: string;
  highlightedEventId?: string | null;
  onBack: () => void;
};

export const defaultFilters: EventFilters = {
  query: '',
  minMag: 0,
  maxMag: 10,
  minDepth: 0,
  maxDepth: 700,
  alert: 'all',
  tsunami: 'all',
  status: 'all'
};

/** Dashboard-level data and view-model types shared across feature pages. */
