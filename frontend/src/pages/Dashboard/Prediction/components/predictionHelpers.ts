import { haversineKm } from '../../../../components/dashboard/data';

export type UserLocation = {
  latitude: number;
  longitude: number;
  label: string;
};

export type GeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

export const radiusOptions = [50, 100, 200, 500];
export const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
export const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

export function formatLocationLabel(parts: { city?: string; region?: string; country?: string }, fallback: string) {
  return [parts.city, parts.region, parts.country].filter(Boolean).join(', ') || fallback;
}

export async function searchLocation(query: string): Promise<GeocodingResult | null> {
  const params = new URLSearchParams({ name: query, count: '1', language: 'en', format: 'json' });
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);

  if (!response.ok) {
    throw new Error('Location search failed.');
  }

  const data = await response.json();
  return data.results?.[0] ?? null;
}

export function distanceKm(latitude1: number, longitude1: number, latitude2: number, longitude2: number) {
  return haversineKm({ lat: latitude1, lon: longitude1 }, { lat: latitude2, lon: longitude2 });
}