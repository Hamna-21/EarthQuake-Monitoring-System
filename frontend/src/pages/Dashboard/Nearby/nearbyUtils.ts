import { countryOf } from '../../../components/dashboard/data';

export type UserLocation = {
  lat: number;
  lon: number;
  city?: string;
  region?: string;
  country?: string;
};

export function directionFromUser(latDelta: number, lonDelta: number) {
  if (Math.abs(latDelta) > Math.abs(lonDelta)) return latDelta >= 0 ? 'North' : 'South';
  return lonDelta >= 0 ? 'East' : 'West';
}

export function placeParts(place: string) {
  const parts = place.split(',').map((part) => part.trim()).filter(Boolean);
  return {
    city: parts[0] || 'Unknown region',
    country: countryOf(place),
  };
}

export async function reverseLocation(lat: number, lon: number): Promise<UserLocation> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
  );
  const data = await response.json();
  const address = data.address ?? {};
  return {
    lat,
    lon,
    city: address.city ?? address.town ?? address.village ?? address.county,
    region: address.state ?? address.province ?? address.region,
    country: address.country,
  };
}
