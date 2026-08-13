type Ring = Array<[number, number]>;
export type LocationBoundary = Array<{ outer: Ring; holes: Ring[] }>;
export type LocationBounds = { south: number; north: number; west: number; east: number };
export type LocationResolution = { boundary: LocationBoundary; bounds?: LocationBounds };
type GeoJson = { type?: string; coordinates?: unknown };

const cache = new Map<string, LocationResolution>();

export async function resolveLocationBoundary(name: string): Promise<LocationResolution> {
  const key = name.trim().toLowerCase();
  if (!key) return { boundary: [] };
  const cached = cache.get(key);
  if (cached) return cached;
  const params = new URLSearchParams({ q: name.trim(), format: 'jsonv2', limit: '1', polygon_geojson: '1' });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { Accept: 'application/json', 'User-Agent': 'Earthquake Monitoring System historical map' }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Location boundary search is temporarily unavailable.');
  const [match] = await response.json() as Array<{ geojson?: GeoJson; boundingbox?: string[] }>;
  const boundary = parseGeometry(match?.geojson);
  if (!boundary.length) throw new Error(`A geographic boundary could not be found for "${name.trim()}".`);
  const box = match?.boundingbox?.map(Number) ?? [];
  const bounds = box.length === 4 && box.every(Number.isFinite) ? { south: box[0], north: box[1], west: box[2], east: box[3] } : undefined;
  const resolved = { boundary, bounds };
  cache.set(key, resolved);
  return resolved;
}

export function containsPoint(boundary: LocationBoundary, longitude: number, latitude: number) {
  return boundary.some(({ outer, holes }) => pointInRing(longitude, latitude, outer) && !holes.some((hole) => pointInRing(longitude, latitude, hole)));
}

function parseGeometry(geometry?: GeoJson): LocationBoundary {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return polygon(geometry.coordinates);
  if (geometry.type === 'MultiPolygon' && Array.isArray(geometry.coordinates)) return geometry.coordinates.flatMap((item) => polygon(item));
  return [];
}

function polygon(value: unknown): LocationBoundary {
  if (!Array.isArray(value) || !value.length) return [];
  const rings = value.map((ring) => toRing(ring)).filter((ring): ring is Ring => Boolean(ring));
  return rings.length ? [{ outer: rings[0], holes: rings.slice(1) }] : [];
}

function toRing(value: unknown): Ring | null {
  if (!Array.isArray(value) || value.length < 3) return null;
  const ring = value.map((point) => Array.isArray(point) && Number.isFinite(Number(point[0])) && Number.isFinite(Number(point[1])) ? [Number(point[0]), Number(point[1])] as [number, number] : null);
  return ring.every(Boolean) ? ring as Ring : null;
}

function pointInRing(longitude: number, latitude: number, ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > latitude) !== (yj > latitude) && longitude < ((xj - xi) * (latitude - yi)) / (yj - yi || Number.EPSILON) + xi) inside = !inside;
  }
  return inside;
}
