import { Earthquake } from '../types';

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

  return {
    id: feature.id,
    magnitude: properties.mag ?? 0,
    place: properties.place || 'Unknown location',
    time: properties.time ?? 0,
    updated: properties.updated ?? 0,
    url: properties.url || '',
    detail: properties.detail || '',
    felt: properties.felt ?? null,
    cdi: properties.cdi ?? null,
    mmi: properties.mmi ?? null,
    alert: properties.alert as 'green' | 'yellow' | 'orange' | 'red' | null,
    status: properties.status || 'unknown',
    tsunami: properties.tsunami ?? 0,
    sig: properties.sig ?? 0,
    longitude: coordinates[0] ?? 0,
    latitude: coordinates[1] ?? 0,
    depth: coordinates[2] ?? 0,
    magType: properties.magType || 'unknown',
  };
}
