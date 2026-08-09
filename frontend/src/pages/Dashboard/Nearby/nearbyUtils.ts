import { countryOf } from '../../../components/dashboard/data';
export { reverseLocation } from '../../../utils/locationApi';

export type UserLocation = {
  lat: number;
  lon: number;
  label?: string;
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

