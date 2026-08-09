import type { Earthquake, EarthquakeAlert } from '../../types';

type Feature = {
  id: string;
  properties?: Record<string, any>;
  geometry?: { coordinates?: number[] };
};

export function assertFeatureCollection(data: any, label: string): asserts data is { features: Feature[] } {
  if (!data.features || !Array.isArray(data.features)) {
    throw new Error(`${label} returned an invalid response`);
  }
}

export function mapFeatureToEarthquake(feature: Feature): Earthquake {
  const properties = feature.properties ?? {};
  const coordinates = feature.geometry?.coordinates ?? [];
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
    longitude: Number(coordinates[0]),
    latitude: Number(coordinates[1]),
    depth: Number(coordinates[2]),
    magType: properties.magType || 'unknown',
    source: 'USGS',
  };
}
