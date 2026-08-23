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
  url?: string;
  detail?: string;
  tsunamiCode?: number | null;
  fetchedAt?: string;
  cdi?: number | null;
  mmi?: number | null;
  sig?: number;
  magType?: string;
}
/** Shared frontend earthquake record types used by maps, tables, and charts. */
