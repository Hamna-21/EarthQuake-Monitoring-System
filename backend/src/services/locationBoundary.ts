type Ring = Array<[number, number]>;
export type LocationBoundary = Array<{ outer: Ring; holes: Ring[]; bounds: LocationBounds }>;
export type LocationBounds = { south: number; north: number; west: number; east: number };
export type LocationKind = 'city' | 'country' | 'region';
export type LocationResolution = { boundary: LocationBoundary; bounds?: LocationBounds; kind: LocationKind; center?: { latitude: number; longitude: number }; radiusKm?: number };
type GeoJson = { type?: string; coordinates?: unknown };

const cache = new Map<string, LocationResolution>();

// Resolve a searched place once, retaining its polygon and bounds for later historical requests.
export async function resolveLocationBoundary(name: string): Promise<LocationResolution> {
  const key = name.trim().toLowerCase();
  if (!key) return { boundary: [], kind: 'region' };
  const cached = cache.get(key);
  if (cached) return cached;
  const params = new URLSearchParams({ q: name.trim(), format: 'jsonv2', limit: '1', polygon_geojson: '1' });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { Accept: 'application/json', 'User-Agent': 'Earthquake Monitoring System historical map' }, signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Location boundary search is temporarily unavailable.');
  const [match] = await response.json() as Array<{ geojson?: GeoJson; boundingbox?: string[]; lat?: string; lon?: string; type?: string; addresstype?: string; class?: string }>;
  const boundary = parseGeometry(match?.geojson);
  const box = match?.boundingbox?.map(Number) ?? [];
  const latitude = Number(match?.lat), longitude = Number(match?.lon);
  const center = Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : undefined;
  const addressType = String(match?.addresstype ?? match?.type ?? '').toLowerCase();
  const kind: LocationKind = ['city', 'town', 'village', 'municipality', 'suburb'].includes(addressType) ? 'city' : ['country', 'state', 'province', 'territory'].includes(addressType) || match?.class === 'boundary' ? 'country' : 'region';
  const radiusKm = kind === 'city' ? 150 : undefined;
  const radiusBounds = center && radiusKm ? boundsAround(center.latitude, center.longitude, radiusKm) : undefined;
  const bounds = radiusBounds ?? (box.length === 4 && box.every(Number.isFinite) ? { south: box[0], north: box[1], west: box[2], east: box[3] } : undefined);
  if (!boundary.length && !bounds) throw new Error(`A geographic boundary could not be found for "${name.trim()}".`);
  const resolved = { boundary, bounds, kind, center, radiusKm };
  cache.set(key, resolved);
  return resolved;
}

function boundsAround(latitude: number, longitude: number, radiusKm: number): LocationBounds {
  const latDelta = radiusKm / 111.32;
  const lonDelta = radiusKm / (111.32 * Math.max(0.2, Math.cos(latitude * Math.PI / 180)));
  return { south: Math.max(-90, latitude - latDelta), north: Math.min(90, latitude + latDelta), west: Math.max(-180, longitude - lonDelta), east: Math.min(180, longitude + lonDelta) };
}

// Keep only events whose exact coordinates fall inside the selected place, including holes in polygons.
export function containsPoint(boundary: LocationBoundary, longitude: number, latitude: number) {
  return boundary.some(({ outer, holes, bounds }) => {
    if (longitude < bounds.west || longitude > bounds.east || latitude < bounds.south || latitude > bounds.north) return false;
    return pointInRing(longitude, latitude, outer) && !holes.some((hole) => pointInRing(longitude, latitude, hole));
  });
}

/** Parses and normalizes geometry for the module's data flow. */
function parseGeometry(geometry?: GeoJson): LocationBoundary {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return polygon(geometry.coordinates);
  if (geometry.type === 'MultiPolygon' && Array.isArray(geometry.coordinates)) return geometry.coordinates.flatMap((item) => polygon(item));
  return [];
}

/** Coordinates polygon for this module. */
function polygon(value: unknown): LocationBoundary {
  if (!Array.isArray(value) || !value.length) return [];
  const rings = value.map((ring) => toRing(ring)).filter((ring): ring is Ring => Boolean(ring));
  return rings.length ? [{ outer: rings[0], holes: rings.slice(1), bounds: ringBounds(rings[0]) }] : [];
}

/** Parses and normalizes ring for the module's data flow. */
function toRing(value: unknown): Ring | null {
  if (!Array.isArray(value) || value.length < 3) return null;
  const ring = value.map((point) => Array.isArray(point) && Number.isFinite(Number(point[0])) && Number.isFinite(Number(point[1])) ? [Number(point[0]), Number(point[1])] as [number, number] : null);
  return ring.every(Boolean) ? ring as Ring : null;
}

// Skip polygon rings that cannot contain the point before running the expensive ray-casting check.
function ringBounds(ring: Ring): LocationBounds {
  return ring.reduce((bounds, [longitude, latitude]) => ({
    south: Math.min(bounds.south, latitude), north: Math.max(bounds.north, latitude),
    west: Math.min(bounds.west, longitude), east: Math.max(bounds.east, longitude),
  }), { south: 90, north: -90, west: 180, east: -180 });
}

/** Coordinates point in ring for this module. */
function pointInRing(longitude: number, latitude: number, ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > latitude) !== (yj > latitude) && longitude < ((xj - xi) * (latitude - yi)) / (yj - yi || Number.EPSILON) + xi) inside = !inside;
  }
  return inside;
}
