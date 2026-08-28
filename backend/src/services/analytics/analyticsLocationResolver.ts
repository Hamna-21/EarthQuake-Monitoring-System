import type { ValidatedAnalyticsQuery } from './analyticsQuery';
import { resolveLocationBoundary, containsPoint, type LocationBoundary } from '../locationBoundary';

type ResolvedLocation = Pick<ValidatedAnalyticsQuery, 'bounds' | 'locationPolygons' | 'locationKind' | 'locationCenter' | 'locationRadiusKm'>;
const cache = new Map<string, ResolvedLocation>();

export class AnalyticsLocationError extends Error {
  constructor(message = 'Location could not be resolved. Please check the location and try again.') {
    super(message);
    this.name = 'AnalyticsLocationError';
  }
}

// Resolve a named place to cached bounds and polygons before fetching data, keeping geography consistent downstream.
export async function resolveAnalyticsLocation(query: ValidatedAnalyticsQuery) {
  if (query.region === 'pakistan' || !query.location) return query;
  const key = query.location.toLowerCase();
  const cached = cache.get(key);
  if (cached) return { ...query, ...cached };
  let resolvedBoundary: LocationBoundary;
  let result: Awaited<ReturnType<typeof resolveLocationBoundary>>;
  let resolvedBounds: { south: number; north: number; west: number; east: number } | undefined;
  try {
    result = await resolveLocationBoundary(query.location);
    resolvedBoundary = result.boundary;
    resolvedBounds = result.bounds;
  } catch {
    throw new AnalyticsLocationError();
  }
  if (!resolvedBounds || (result.kind !== 'city' && !resolvedBoundary.length)) throw new AnalyticsLocationError();
  const resolved = { bounds: { minLatitude: resolvedBounds.south, maxLatitude: resolvedBounds.north, minLongitude: resolvedBounds.west, maxLongitude: resolvedBounds.east }, locationPolygons: resolvedBoundary, locationKind: result.kind, locationCenter: result.center, locationRadiusKm: result.radiusKm };
  cache.set(key, resolved);
  return { ...query, ...resolved };
}

// Prefer exact polygon membership and fall back to resolved bounds only when no polygon is available.
export function insideResolvedLocation(query: ValidatedAnalyticsQuery, longitude: number, latitude: number) {
  if (query.locationKind === 'city' && query.locationCenter && query.locationRadiusKm) {
    return distanceKm(query.locationCenter.latitude, query.locationCenter.longitude, latitude, longitude) <= query.locationRadiusKm;
  }
  if (query.locationPolygons?.length) return containsPoint(query.locationPolygons as LocationBoundary, longitude, latitude);
  if (query.bounds) return longitude >= query.bounds.minLongitude && longitude <= query.bounds.maxLongitude && latitude >= query.bounds.minLatitude && latitude <= query.bounds.maxLatitude;
  return true;
}

function distanceKm(latitudeA: number, longitudeA: number, latitudeB: number, longitudeB: number) {
  const radians = Math.PI / 180;
  const dLat = (latitudeB - latitudeA) * radians;
  const dLon = (longitudeB - longitudeA) * radians;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(latitudeA * radians) * Math.cos(latitudeB * radians) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
