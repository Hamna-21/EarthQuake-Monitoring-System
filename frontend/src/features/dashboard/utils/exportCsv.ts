import type { Earthquake } from '@/types';

const columns = ['Date/Time UTC', 'Place', 'Country', 'Magnitude', 'Depth', 'Latitude', 'Longitude', 'USGS ID', 'URL'];

/** Renders or coordinates escape csv value for this frontend module. */
export function escapeCsvValue(value: unknown) {
  const text = value == null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Builds the build earthquake csv result used by the surrounding component. */
export function buildEarthquakeCsv(events: Earthquake[]) {
  // Flatten the normalized earthquake model into an escaped CSV that preserves commas and line breaks in place names.
  const rows = events.map((event) => [formatUtc(event.time), event.place, countryFromPlace(event.place), number(event.magnitude), number(event.depth), number(event.latitude), number(event.longitude), event.id, event.detailUrl ?? event.url ?? '']);
  return [columns, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\r\n');
}

/** Renders or coordinates download csv for this frontend module. */
export function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Handles get earthquake csv filename and keeps the related frontend state or data flow consistent. */
export function getEarthquakeCsvFilename(filters: { query?: string; startDate?: string; endDate?: string }) {
  const location = safePart(filters.query || 'filtered-results');
  const start = safePart(filters.startDate?.slice(0, 10) || '');
  const end = safePart(filters.endDate?.slice(0, 10) || '');
  return `geopulse-earthquakes-${location}${start ? `-${start}` : ''}${end ? `-${end}` : ''}.csv`;
}

/** Normalizes a filter value so it is safe to include in a CSV filename. */
function safePart(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'filtered-results'; }

/** Converts a finite numeric earthquake value into a CSV-safe cell. */
function number(value: number | null | undefined) { return typeof value === 'number' && Number.isFinite(value) ? value : ''; }

/** Formats an earthquake timestamp for the exported UTC column. */
function formatUtc(value: string) { const date = new Date(value); return Number.isFinite(date.getTime()) ? date.toISOString() : value || ''; }

/** Extracts the country portion from the provider's comma-separated place label. */
function countryFromPlace(place: string) { const parts = place.split(',').map((part) => part.trim()).filter(Boolean); return parts.length > 1 ? parts[parts.length - 1] : ''; }
