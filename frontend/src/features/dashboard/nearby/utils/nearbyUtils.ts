import { countryOf } from '@/features/dashboard/utils/data';
export { reverseLocation } from '@/features/dashboard/nearby/services/locationService';

export type UserLocation = {
  lat: number;
  lon: number;
  label?: string;
  city?: string;
  region?: string;
  country?: string;
};

// Convert signed latitude/longitude deltas into a compact compass direction for nearby cards.
export function directionFromUser(latDelta: number, lonDelta: number) {
  if (Math.abs(latDelta) > Math.abs(lonDelta)) return latDelta >= 0 ? 'North' : 'South';
  return lonDelta >= 0 ? 'East' : 'West';
}

// Split a provider place string into a display city and country label.
export function placeParts(place: string) {
  const parts = place.split(',').map((part) => part.trim()).filter(Boolean);
  return {
    city: parts[0] || 'Unknown region',
    country: countryOf(place),
  };
}

