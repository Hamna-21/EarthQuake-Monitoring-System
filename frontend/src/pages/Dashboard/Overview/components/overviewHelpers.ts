import { Earthquake } from '../../../../types';
import { countryOf } from '../../../../components/dashboard/data';

export const toneStyles = {
  neutral: { chip: 'bg-slate-100 text-slate-600' },
  positive: { chip: 'bg-emerald-50 text-emerald-700' },
  alert: { chip: 'bg-red-50 text-red-700' },
} as const;

export const spark = (seed: number) => Array.from({ length: 7 }, (_, i) => 28 + ((seed * (i + 3) * 37) % 62));

export function topActiveCountry(events: Earthquake[]) {
  const counts = new Map<string, number>();
  events.forEach((event) => counts.set(countryOf(event.place), (counts.get(countryOf(event.place)) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
}
