import { Earthquake } from '@/types';

/** Parses and formats country from place for the surrounding UI or data flow. */
export function countryFromPlace(place: string) {
  const parts = place.split(',');
  return parts.length > 1 ? parts[parts.length - 1].trim() : place;
}

// Derive landing-page summary values from the same normalized live event records as the dashboard.
export function strongest(events: Earthquake[]) {
  return events.reduce<Earthquake | null>(
    (top, event) => (!top || event.magnitude > top.magnitude ? event : top),
    null
  );
}

/** Builds the average magnitude result used by the surrounding component. */
export function averageMagnitude(events: Earthquake[]) {
  if (!events.length) return '0.0';
  const total = events.reduce((sum, event) => sum + event.magnitude, 0);
  return (total / events.length).toFixed(1);
}

/** Builds the most active country result used by the surrounding component. */
export function mostActiveCountry(events: Earthquake[]) {
  const counts = new Map<string, number>();
  events.forEach((event) => {
    const country = countryFromPlace(event.place);
    counts.set(country, (counts.get(country) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Global';
}
