export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number; // Unix timestamp in ms
  updated: number;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null; // Community Decimal Intensity
  mmi: number | null; // Maximum Modified Mercalli Intensity
  alert: 'green' | 'yellow' | 'orange' | 'red' | null;
  status: string;
  tsunami: number; // 0 or 1
  sig: number; // Significance score
  longitude: number;
  latitude: number;
  depth: number; // Depth in km
  magType: string;
}

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
