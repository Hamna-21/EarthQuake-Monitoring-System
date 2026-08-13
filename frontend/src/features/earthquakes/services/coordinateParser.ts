export type GeoPoint = { longitude: number; latitude: number; depth: number | null };

/** USGS GeoJSON order is [longitude, latitude, depth]. */
export function parseUsgsCoordinates(value: unknown): GeoPoint | null {
  if (!Array.isArray(value)) return null;
  const longitude = Number(value[0]);
  const latitude = Number(value[1]);
  const depthValue = Number(value[2]);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return null;
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) return null;
  return { longitude, latitude, depth: Number.isFinite(depthValue) ? depthValue : null };
}
