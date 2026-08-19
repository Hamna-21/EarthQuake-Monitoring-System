import type { Earthquake, EarthquakeAlert } from '@/types';
import { parseUsgsCoordinates } from './coordinateParser';

type UsgsProperties = {
  mag?: number | null;
  place?: string | null;
  time?: number | null;
  updated?: number | null;
  url?: string | null;
  detail?: string | null;
  felt?: number | null;
  cdi?: number | null;
  mmi?: number | null;
  alert?: string | null;
  status?: string | null;
  tsunami?: number | null;
  sig?: number | null;
  magType?: string | null;
};

type Feature = {
  id: string;
  properties?: UsgsProperties;
  geometry?: { coordinates?: number[] };
};

export function assertFeatureCollection(data: unknown, label: string): asserts data is { features: Feature[] } {
  if (!data || typeof data !== 'object' || !('features' in data) || !Array.isArray(data.features)) {
    throw new Error(`${label} returned an invalid response`);
  }
}

// Convert provider properties and [longitude, latitude, depth] into the app's Earthquake model.
export function mapFeatureToEarthquake(feature: Feature): Earthquake {
  const properties = feature.properties ?? {};
  const point = parseUsgsCoordinates(feature.geometry?.coordinates);
  const alert = ['green', 'yellow', 'orange', 'red'].includes(properties.alert) ? properties.alert : null;
  const time = Number(properties.time);
  const updatedAt = Number(properties.updated);

  return {
    id: feature.id,
    magnitude: Number(properties.mag ?? 0),
    place: properties.place || 'Unknown location',
    time: Number.isFinite(time) && time > 0 ? new Date(time).toISOString() : '',
    updatedAt: Number.isFinite(updatedAt) && updatedAt > 0 ? new Date(updatedAt).toISOString() : '',
    url: properties.url || '',
    detail: properties.detail || '',
    detailUrl: properties.detail || properties.url || undefined,
    felt: properties.felt ?? null,
    cdi: properties.cdi ?? null,
    mmi: properties.mmi ?? null,
    alert: alert as EarthquakeAlert,
    status: properties.status || 'unknown',
    tsunami: properties.tsunami === 1,
    sig: Number(properties.sig) || 0,
    longitude: point?.longitude ?? Number.NaN,
    latitude: point?.latitude ?? Number.NaN,
    depth: point?.depth ?? Number.NaN,
    magType: properties.magType || 'unknown',
    source: 'USGS',
  };
}
