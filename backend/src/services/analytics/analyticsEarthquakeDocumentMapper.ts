import type { AnalyticsEarthquakeDocument } from '../../types/analyticsEarthquakeDocument';
import type { AnalyticsEarthquake } from './normalizeAnalyticsEarthquake';

const alerts = new Set(['green', 'yellow', 'orange', 'red', null]);
const classifications = new Set(['unclassified', 'broad-bounding-box', 'point-in-polygon']);

export class AnalyticsEarthquakeDocumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalyticsEarthquakeDocumentError';
  }
}

const fail = (message: string): never => {
  throw new AnalyticsEarthquakeDocumentError(message);
};

const validDate = (date: Date) => date instanceof Date && Number.isFinite(date.getTime());
const freshDate = (date: Date) => new Date(date.getTime());
const finiteOrNull = (value: number | null, field: string) => {
  if (value !== null && !Number.isFinite(value)) fail(`${field} must be finite when present.`);
  return value;
};

/** Parses and normalizes required date for the module's data flow. */
function parseRequiredDate(value: string, field: string) {
  const date = new Date(value);
  if (!validDate(date)) fail(`${field} must be a valid timestamp.`);
  return date;
}

const parseOptionalDate = (value: string | null, field: string) =>
  value ? parseRequiredDate(value, field) : null;

/** Validates coordinates before the operation continues. */
function validateCoordinates(longitude: number, latitude: number) {
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) fail('Longitude must be between -180 and 180.');
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) fail('Latitude must be between -90 and 90.');
}

/** Validates analytics earthquake document before the operation continues. */
export function validateAnalyticsEarthquakeDocument(document: AnalyticsEarthquakeDocument): void {
  if (!document.usgsId.trim()) fail('USGS ID is required.');
  if (!validDate(document.occurredAt)) fail('occurredAt must be a valid Date.');
  if (document.updatedAtUsgs !== null && !validDate(document.updatedAtUsgs)) fail('updatedAtUsgs must be valid when present.');
  if (document.location.type !== 'Point' || document.location.coordinates.length !== 2) fail('location must be a GeoJSON Point.');
  validateCoordinates(document.location.coordinates[0], document.location.coordinates[1]);
  finiteOrNull(document.magnitude, 'magnitude');
  if (document.depth !== null && (!Number.isFinite(document.depth) || document.depth < 0)) fail('depth must be finite and non-negative.');
  if (!alerts.has(document.alert)) fail('alert must be a valid USGS alert value or null.');
  if (![0, 1, null].includes(document.tsunami)) fail('tsunami must be 0, 1, or null.');
  finiteOrNull(document.significance, 'significance');
  if (document.source !== 'USGS') fail('source must be USGS.');
  if (!classifications.has(document.classificationMethod)) fail('classificationMethod is invalid.');
  if (document.classificationMethod === 'unclassified' && document.insidePakistan !== null) fail('unclassified records must not claim country membership.');
  for (const field of ['fetchedAt', 'createdAt', 'updatedAt'] as const) {
    if (!validDate(document[field])) fail(`${field} must be a valid Date.`);
  }
}

// Convert a normalized provider event into the validated MongoDB document shape used by backfills.
export function toAnalyticsEarthquakeDocument(
  earthquake: AnalyticsEarthquake,
  now: Date = new Date(),
): AnalyticsEarthquakeDocument {
  if (!validDate(now)) fail('now must be a valid Date.');
  const usgsId = (earthquake.usgsId || earthquake.id || '').trim();
  if (!usgsId) fail('USGS ID is required.');
  validateCoordinates(earthquake.longitude, earthquake.latitude);
  const timestamp = freshDate(now);
  const document: AnalyticsEarthquakeDocument = {
    usgsId,
    magnitude: finiteOrNull(earthquake.magnitude, 'magnitude'),
    magnitudeType: earthquake.magnitudeType ?? earthquake.magType ?? null,
    place: earthquake.place || 'Location unavailable',
    occurredAt: parseRequiredDate(earthquake.time, 'time'),
    updatedAtUsgs: parseOptionalDate(earthquake.updatedAt, 'updatedAt'),
    location: { type: 'Point', coordinates: [earthquake.longitude, earthquake.latitude] },
    depth: earthquake.depth, alert: earthquake.alert, tsunami: earthquake.tsunami ?? earthquake.tsunamiCode ?? null,
    significance: earthquake.significance ?? earthquake.sig ?? null, status: earthquake.status,
    source: 'USGS', sourceUrl: earthquake.url, detailUrl: earthquake.detailUrl,
    insidePakistan: null, classificationMethod: 'unclassified',
    fetchedAt: freshDate(timestamp), createdAt: freshDate(timestamp), updatedAt: freshDate(timestamp),
  };
  validateAnalyticsEarthquakeDocument(document);
  return document;
}

