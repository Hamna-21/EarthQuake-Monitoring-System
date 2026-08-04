import type { Earthquake } from '../../../types';

const validNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export function formatMagnitude(value?: number | null) {
  return validNumber(value) ? value.toFixed(1) : 'Unknown';
}

export function formatMagnitudeWithType(event: Earthquake) {
  const mag = formatMagnitude(event.magnitude);
  return event.magType ? `${mag} ${event.magType}` : `${mag} MAG`;
}

export function formatDepth(value?: number | null) {
  return validNumber(value) ? `${value.toFixed(1)} km` : 'Unknown';
}

export function formatPlace(value?: string | null) {
  return value?.trim() || 'Location unavailable';
}

export function formatAlert(value?: string | null) {
  return value ? value.toUpperCase() : 'Not Available';
}

export function formatTsunami(event: Earthquake) {
  if (event.tsunamiCode === 1) return 'Yes';
  if (event.tsunamiCode === 0) return 'No';
  if ('tsunamiCode' in event) return 'Not Recorded';
  return typeof event.tsunami === 'boolean' ? (event.tsunami ? 'Yes' : 'No') : 'Not Recorded';
}

export function formatUtcTime(time?: string | null) {
  const parsed = Date.parse(String(time ?? ''));
  if (!Number.isFinite(parsed)) return 'Time unavailable';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(new Date(parsed));
}

export function formatCoords(event: Earthquake) {
  const lat = validNumber(event.latitude) ? event.latitude.toFixed(4) : 'Unknown';
  const lon = validNumber(event.longitude) ? event.longitude.toFixed(4) : 'Unknown';
  return `${lat}, ${lon}`;
}

export function formatFetchedAt(event: Earthquake) {
  return event.fetchedAt ? formatUtcTime(event.fetchedAt) : 'This session';
}
