import type { ValidatedAnalyticsQuery } from './analyticsQuery';
import { resolveLocationBoundary, containsPoint, type LocationBoundary } from '../locationBoundary';

type ResolvedLocation = Pick<ValidatedAnalyticsQuery, 'bounds' | 'locationPolygons'>;
const cache = new Map<string, ResolvedLocation>();

export class AnalyticsLocationError extends Error {
  constructor(message = 'Location could not be resolved. Please check the location and try again.') {
    super(message);
    this.name = 'AnalyticsLocationError';
  }
}

export async function resolveAnalyticsLocation(query: ValidatedAnalyticsQuery) {
  if (query.region === 'pakistan' || !query.location) return query;
  const key = query.location.toLowerCase();
  const cached = cache.get(key);
  if (cached) return { ...query, ...cached };
  let resolvedBoundary: LocationBoundary;
  let resolvedBounds: { south: number; north: number; west: number; east: number } | undefined;
  try {
    const result = await resolveLocationBoundary(query.location);
    resolvedBoundary = result.boundary;
    resolvedBounds = result.bounds;
  } catch {
    throw new AnalyticsLocationError();
  }
  if (!resolvedBoundary.length || !resolvedBounds) throw new AnalyticsLocationError();
  const resolved = { bounds: { minLatitude: resolvedBounds.south, maxLatitude: resolvedBounds.north, minLongitude: resolvedBounds.west, maxLongitude: resolvedBounds.east }, locationPolygons: resolvedBoundary };
  cache.set(key, resolved);
  return { ...query, ...resolved };
}

export function insideResolvedLocation(query: ValidatedAnalyticsQuery, longitude: number, latitude: number) {
  if (query.locationPolygons?.length) return containsPoint(query.locationPolygons as LocationBoundary, longitude, latitude);
  if (query.bounds) return longitude >= query.bounds.minLongitude && longitude <= query.bounds.maxLongitude && latitude >= query.bounds.minLatitude && latitude <= query.bounds.maxLatitude;
  return true;
}
