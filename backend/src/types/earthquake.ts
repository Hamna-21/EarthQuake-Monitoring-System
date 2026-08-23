// Normalized earthquake contract shared by API responses, maps, tables, and analytics.
export type EarthquakeAlert = 'green' | 'yellow' | 'orange' | 'red' | null;

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  latitude: number;
  longitude: number;
  depth: number;
  time: string;
  updatedAt: string;
  alert: EarthquakeAlert;
  tsunami: boolean;
  felt: number | null;
  status: string;
  source: 'USGS';
  detailUrl?: string;
  tsunamiCode?: number | null;
  fetchedAt?: string;
}
