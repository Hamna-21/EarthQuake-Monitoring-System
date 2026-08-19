import type { Earthquake, EarthquakeAlert } from '../types/earthquake';

const USGS_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const ranges: Record<string, number> = { '24h': 24 * 60 * 60 * 1000, '7d': 7 * 24 * 60 * 60 * 1000, '30d': 30 * 24 * 60 * 60 * 1000 };

type UsgsFeature = { id: string; properties?: Record<string, any>; geometry?: { coordinates?: number[] } };

export type EarthquakeRecord = Earthquake & {
  url?: string;
  detail?: string;
  tsunamiCode?: number | null;
  fetchedAt?: string;
  cdi?: number | null;
  mmi?: number | null;
  sig?: number;
  magType?: string;
};

const toIso = (value: unknown) => {
  const time = Number(value);
  return Number.isFinite(time) && time > 0 ? new Date(time).toISOString() : '';
};

const alertOf = (value: unknown): EarthquakeAlert =>
  ['green', 'yellow', 'orange', 'red'].includes(String(value)) ? (value as EarthquakeAlert) : null;

const timeMs = (time: string) => {
  const value = Date.parse(time);
  return Number.isFinite(value) ? value : 0;
};

function applyQueryFilters(records: EarthquakeRecord[], query: Record<string, any>) {
  const region = String(query.region ?? query.search ?? '').trim().toLowerCase();
  const alert = String(query.alert ?? query.alertClass ?? 'all');
  const tsunami = String(query.tsunami ?? 'all');
  const sort = String(query.sort ?? query.orderby ?? 'time');

  return records
    .filter((event) => !region || event.place.toLowerCase().includes(region) || event.id.toLowerCase().includes(region))
    .filter((event) => alert === 'all' || (alert === 'yellow' ? event.alert || event.magnitude >= 5 : event.alert === alert))
    .filter((event) => tsunami === 'all' || (tsunami === 'yes' ? event.tsunami : !event.tsunami))
    .sort((a, b) => (sort === 'magnitude' ? b.magnitude - a.magnitude : timeMs(b.time) - timeMs(a.time)));
}

// Normalize the provider's GeoJSON feature so maps, tables, and charts share one coordinate model.
export function mapUsgsFeature(feature: UsgsFeature): EarthquakeRecord {
  const properties = feature.properties ?? {};
  const coordinates = feature.geometry?.coordinates ?? [];
  const tsunamiCode = properties.tsunami === 1 || properties.tsunami === 0 ? properties.tsunami : null;
  return {
    id: feature.id,
    magnitude: Number(properties.mag),
    place: properties.place ?? 'Location unavailable',
    longitude: Number(coordinates[0]),
    latitude: Number(coordinates[1]),
    depth: Number(coordinates[2]),
    time: toIso(properties.time),
    updatedAt: toIso(properties.updated ?? properties.time),
    alert: alertOf(properties.alert),
    tsunami: properties.tsunami === 1,
    felt: properties.felt ?? null,
    status: properties.status ?? 'unknown',
    source: 'USGS',
    detailUrl: properties.url ?? properties.detail,
    url: properties.url ?? '',
    detail: properties.detail ?? '',
    tsunamiCode,
    fetchedAt: new Date().toISOString(),
    cdi: properties.cdi ?? null,
    mmi: properties.mmi ?? null,
    sig: Number(properties.sig ?? 0),
    magType: properties.magType ?? undefined,
  };
}

// Fetch recent events from the upstream feed, then apply the dashboard's display filters locally.
export async function fetchRealtimeEarthquakes(query: Record<string, any>) {
  const timeframe = String(query.timeframe ?? '24h');
  const minMagnitude = String(query.minMagnitude ?? query.minmagnitude ?? 4);
  const limit = String(query.limit ?? 150);
  const starttime = new Date(Date.now() - (ranges[timeframe] ?? ranges['24h'])).toISOString();
  const params = new URLSearchParams({ format: 'geojson', starttime, minmagnitude: minMagnitude, limit, orderby: 'time' });
  const response = await fetch(`${USGS_URL}?${params.toString()}`);

  if (!response.ok) throw new Error(`USGS request failed with status ${response.status}`);
  const data = await response.json();
  const features = Array.isArray(data.features) ? data.features : [];
  const earthquakes = applyQueryFilters(features.map(mapUsgsFeature), query);

  return {
    success: true,
    source: 'USGS',
    lastUpdated: new Date().toISOString(),
    count: earthquakes.length,
    earthquakes,
  };
}
