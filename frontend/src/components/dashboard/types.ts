import { Earthquake } from '../../types';

export type DashboardPage =
  | 'overview'
  | 'feed'
  | 'map'
  | 'history'
  | 'analytics'
  | 'details'
  | 'nearby'
  | 'alerts'
  | 'ai_assistant';

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
  selectedEvent: Earthquake | null;
  setSelectedId: (id: string | null) => void;
  setSelectedEvent?: (event: Earthquake | null) => void;
  openPage: (page: DashboardPage) => void;
  globalSearch?: string;
  highlightedEventId?: string | null;
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
