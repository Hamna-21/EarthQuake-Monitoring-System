import { Earthquake } from '@/types';
import { countryOf } from '@/features/dashboard/utils/data';

export const toneStyles = {
  neutral: { chip: 'bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/20' },
  positive: { chip: 'bg-emerald-400/10 text-emerald-100 ring-1 ring-emerald-300/20' },
  alert: { chip: 'bg-red-400/10 text-red-100 ring-1 ring-red-300/20' },
} as const;

export const spark = (seed: number) => Array.from({ length: 7 }, (_, i) => 28 + ((seed * (i + 3) * 37) % 62));

/** Parses and formats top active country for the surrounding UI or data flow. */
export function topActiveCountry(events: Earthquake[]) {
  const counts = new Map<string, number>();
  events.forEach((event) => counts.set(countryOf(event.place), (counts.get(countryOf(event.place)) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
}
/** Small formatting helpers used to build the dashboard overview sections. */
