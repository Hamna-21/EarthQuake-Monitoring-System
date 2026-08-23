import type { Earthquake } from '@/types';

const validNumber = (value: number) => Number.isFinite(value);
const validCoordinates = (event: Earthquake) =>
  validNumber(event.latitude) &&
  validNumber(event.longitude) &&
  event.latitude >= -90 &&
  event.latitude <= 90 &&
  event.longitude >= -180 &&
  event.longitude <= 180;

/** Renders or coordinates validation issues for this frontend module. */
export function validationIssues(event: Earthquake) {
  const issues: string[] = [];
  if (!event.id) issues.push('missing unique API id');
  if (!validNumber(event.magnitude)) issues.push('invalid magnitude');
  if (!event.place?.trim()) issues.push('missing location');
  if (!event.time || Number.isNaN(Date.parse(event.time))) issues.push('invalid event time');
  if (!validNumber(event.depth)) issues.push('invalid depth');
  if (!validCoordinates(event)) issues.push('invalid coordinates');
  if (typeof event.tsunami !== 'boolean') issues.push('invalid tsunami flag');
  if (event.alert && !['green', 'yellow', 'orange', 'red'].includes(event.alert)) issues.push('invalid alert level');
  return issues;
}

/** Renders or coordinates clean earthquakes for this frontend module. */
export function cleanEarthquakes(events: Earthquake[], source: string) {
  // Drop malformed or duplicate events before they reach maps, records, or analytics.
  const seen = new Set<string>();
  const clean: Earthquake[] = [];

  events.forEach((event) => {
    const issues = validationIssues(event);
    if (seen.has(event.id)) issues.push('duplicate API id');
    if (issues.length) {
      if (import.meta.env.DEV) console.warn(`[Earthquake Monitoring System data warning] ${source}`, { id: event.id, issues, event });
      return;
    }
    seen.add(event.id);
    clean.push(event);
  });

  return clean;
}
