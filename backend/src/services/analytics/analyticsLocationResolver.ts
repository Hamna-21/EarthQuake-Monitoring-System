import type { ValidatedAnalyticsQuery } from './analyticsQuery';

type ResolvedLocation = Pick<ValidatedAnalyticsQuery, 'bounds' | 'locationPolygons'>;
const cache = new Map<string, ResolvedLocation>();

export async function resolveAnalyticsLocation(query: ValidatedAnalyticsQuery) {
  if (query.region === 'pakistan' || !query.location) return query;
  const key = query.location.toLowerCase();
  const cached = cache.get(key);
  if (cached) return { ...query, ...cached };
  const params = new URLSearchParams({ q: query.location, format: 'jsonv2', limit: '1', polygon_geojson: '1' });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { 'User-Agent': 'GeoPulse historical analytics' }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Location search is temporarily unavailable.');
  const [match] = await response.json() as Array<{ boundingbox?: string[]; geojson?: { type?: string; coordinates?: unknown } }>;
  const values = match?.boundingbox?.map(Number) ?? [];
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) throw new Error('Location was not found. Try a country, city, or region name.');
  const [south, north, west, east] = values;
  const polygons = polygonsOf(match.geojson);
  const resolved = { bounds: { minLatitude: south, maxLatitude: north, minLongitude: west, maxLongitude: east }, locationPolygons: polygons };
  cache.set(key, resolved);
  return { ...query, ...resolved };
}

export function insideResolvedLocation(query: ValidatedAnalyticsQuery, longitude: number, latitude: number) {
  if (query.locationPolygons?.length) return query.locationPolygons.some((polygon) => pointInRing(longitude, latitude, polygon));
  if (query.bounds) return longitude >= query.bounds.minLongitude && longitude <= query.bounds.maxLongitude && latitude >= query.bounds.minLatitude && latitude <= query.bounds.maxLatitude;
  return true;
}

function polygonsOf(geojson: { type?: string; coordinates?: unknown } | undefined): Array<Array<[number, number]>> {
  if (geojson?.type === 'Polygon' && Array.isArray(geojson.coordinates)) return [ring(geojson.coordinates[0])].filter(Boolean) as Array<Array<[number, number]>>;
  if (geojson?.type === 'MultiPolygon' && Array.isArray(geojson.coordinates)) return geojson.coordinates.map((polygon) => Array.isArray(polygon) ? ring(polygon[0]) : null).filter(Boolean) as Array<Array<[number, number]>>;
  return [];
}

function ring(value: unknown) { return Array.isArray(value) && value.every((point) => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1])) ? value.map((point) => [Number(point[0]), Number(point[1])] as [number, number]) : null; }
function pointInRing(lon: number, lat: number, polygon: Array<[number, number]>) { let inside = false; for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) { const [xi, yi] = polygon[i], [xj, yj] = polygon[j]; if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi || Number.EPSILON) + xi) inside = !inside; } return inside; }
