import { countryOf } from '@/features/dashboard/utils/data';

export type UserLocation = {
  lat: number;
  lon: number;
  city?: string;
  area?: string;
  country?: string;
  label: string;
};

export function directionFromUser(latDelta: number, lonDelta: number) {
  if (Math.abs(latDelta) > Math.abs(lonDelta)) return latDelta >= 0 ? 'North' : 'South';
  return lonDelta >= 0 ? 'East' : 'West';
}

export function placeParts(place: string) {
  const parts = place.split(',').map((p) => p.trim()).filter(Boolean);
  return { city: parts[0] || 'Unknown region', country: countryOf(place) };
}

export async function reverseLocation(lat: number, lon: number): Promise<UserLocation> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1&zoom=14`;

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.status}`);

  const data = await res.json();
  const a = data.address ?? {};

  const city = a.city ?? a.town ?? a.village ?? a.county ?? '';
  const area = a.suburb ?? a.city_district ?? a.town ?? a.neighbourhood ?? '';
  const country = a.country ?? '';

  const label = [city, area].filter((v) => v && v !== city ? v : v === city ? v : v).length
    ? [city, area !== city ? area : ''].filter(Boolean).join(', ')
    : city || 'Current location';

  return { lat, lon, city, area, country, label };
}