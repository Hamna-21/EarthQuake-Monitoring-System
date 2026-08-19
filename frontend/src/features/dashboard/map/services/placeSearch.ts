export type PlaceFocus = { lat: number; lng: number; label: string; altitude: number; bounds?: { south: number; north: number; west: number; east: number } };

const cache = new Map<string, PlaceFocus>();
const requests = new Map<string, Promise<PlaceFocus | null>>();

// Resolve a place once, cache its exact coordinates/bounds, and share in-flight searches for identical terms.
export async function resolvePlace(query: string, signal?: AbortSignal): Promise<PlaceFocus | null> {
  const term = query.trim();
  if (!term) return null;
  const cached = cache.get(term.toLowerCase());
  if (cached) return cached;
  const key = term.toLowerCase();
  const request = requests.get(key) ?? (async () => {
    const params = new URLSearchParams({ q: term, format: 'jsonv2', limit: '1', addressdetails: '1' });
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Location search is temporarily unavailable.');
    const [match] = await response.json() as Array<{ lat?: string; lon?: string; display_name?: string; boundingbox?: string[] }>;
    const lat = Number(match?.lat), lng = Number(match?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error(`Location was not found for "${term}".`);
    const box = match?.boundingbox?.map(Number) ?? [];
    const place: PlaceFocus = { lat, lng, label: match?.display_name ?? term, altitude: 1.15 };
    if (box.length === 4 && box.every(Number.isFinite)) {
      place.bounds = { south: box[0], north: box[1], west: box[2], east: box[3] };
      const span = Math.max(box[1] - box[0], box[3] - box[2]);
      place.altitude = span > 30 ? 1.65 : span > 12 ? 1.38 : span > 4 ? 1.18 : span > 1 ? 0.95 : 0.78;
    }
    cache.set(key, place);
    return place;
  })();
  requests.set(key, request);
  try {
    const place = await request;
    if (signal?.aborted) throw new DOMException('The location request was cancelled.', 'AbortError');
    return place;
  } finally { if (requests.get(key) === request) requests.delete(key); }
}
