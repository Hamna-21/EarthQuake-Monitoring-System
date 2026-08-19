import type { EarthquakeAlert } from '../../types/earthquake';

export type UsgsFeature = {
  id?: unknown;
  properties?: Record<string, unknown>;
  geometry?: { type?: unknown; coordinates?: unknown[] };
};

export type AnalyticsEarthquake = {
  id: string;
  usgsId: string;
  magnitude: number | null;
  magnitudeType: string | null;
  magType: string | null;
  place: string;
  time: string;
  updatedAt: string | null;
  longitude: number;
  latitude: number;
  depth: number | null;
  alert: EarthquakeAlert;
  tsunami: 0 | 1 | null;
  tsunamiCode: 0 | 1 | null;
  significance: number | null;
  sig: number | null;
  status: string | null;
  source: 'USGS';
  url: string | null;
  detailUrl: string | null;
  detail: string | null;
};

const alerts = new Set(['green', 'yellow', 'orange', 'red']);

const num = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const text = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed || null;
};

const iso = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? new Date(parsed).toISOString() : null;
};

const alertOf = (value: unknown): EarthquakeAlert => {
  const alert = String(value ?? '').toLowerCase();
  return alerts.has(alert) ? (alert as EarthquakeAlert) : null;
};

const tsunamiOf = (value: unknown) => (value === 1 || value === 0 ? value : null);

// Validate provider geometry and normalize nullable properties before analytics aggregation or persistence.
export function normalizeAnalyticsFeature(feature: UsgsFeature): AnalyticsEarthquake | null {
  const id = text(feature.id);
  const properties = feature.properties ?? {};
  const coordinates = feature.geometry?.coordinates;
  if (!id || feature.geometry?.type !== 'Point' || !Array.isArray(coordinates)) return null;
  const longitude = num(coordinates[0]);
  const latitude = num(coordinates[1]);
  const time = iso(properties.time);
  if (longitude === null || latitude === null || !time) return null;
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) return null;
  const magType = text(properties.magType);
  const significance = num(properties.sig);
  const url = text(properties.url);
  const detail = text(properties.detail);
  const tsunami = tsunamiOf(properties.tsunami);
  return {
    id, usgsId: id, magnitude: num(properties.mag), magnitudeType: magType, magType,
    place: text(properties.place) ?? 'Location unavailable', time, updatedAt: iso(properties.updated),
    longitude, latitude, depth: num(coordinates[2]), alert: alertOf(properties.alert),
    tsunami, tsunamiCode: tsunami, significance, sig: significance, status: text(properties.status),
    source: 'USGS', url, detailUrl: url ?? detail, detail,
  };
}

