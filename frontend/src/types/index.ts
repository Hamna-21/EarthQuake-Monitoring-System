export type { Earthquake, EarthquakeAlert } from '@/types/earthquake';

export interface SeismicFilters {
  viewType: 'live' | 'historical';
  region: string;
  minMagnitude: number;
  timeframe: '24h' | '7d' | '30d' | 'custom';
  alertClass: 'all' | 'yellow' | 'red';
}

export interface SeismicStats {
  totalCount: number;
  avgMagnitude: number;
  maxMagnitude: number;
  tsunamiCount: number;
  significantCount: number;
  avgDepth: number;
}
/** Public type exports shared by frontend features and reusable components. */
