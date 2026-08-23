import type { Earthquake } from '@/types';
import { countryOf } from '@/features/dashboard/utils/data';

export type Row = { label: string; value: number; color?: string; help?: string };
export type Point = { x: number; y: number; label: string; color: string };

// Transform normalized events into fixed bins consumed by the dashboard chart components.
export const magnitudeRows = (events: Earthquake[]): Row[] => [
  ['Small', 0, 4, '#22d3ee', 'Usually felt lightly or not at all'],
  ['Light', 4, 5, '#34d399', 'Often felt, but usually limited damage'],
  ['Moderate', 5, 6, '#facc15', 'Can cause damage near the center'],
  ['Strong', 6, 7, '#fb923c', 'Can cause serious damage'],
  ['Major', 7, 10, '#f43f5e', 'Can cause widespread damage'],
].map(([label, min, max, color, help]) => ({
  label: String(label),
  value: events.filter((e) => e.magnitude >= Number(min) && e.magnitude < Number(max)).length,
  color: String(color),
  help: String(help),
}));

export const depthRows = (events: Earthquake[]): Row[] => [
  { label: 'Near Surface', value: events.filter((e) => e.depth <= 70).length, color: '#22d3ee', help: 'Closer earthquakes are often more noticeable' },
  { label: 'Mid-Depth', value: events.filter((e) => e.depth > 70 && e.depth <= 300).length, color: '#a78bfa', help: 'Deeper underground, usually spread over wider areas' },
  { label: 'Very Deep', value: events.filter((e) => e.depth > 300).length, color: '#fb7185', help: 'Far below the surface' },
];

export const regionRows = (events: Earthquake[]): Row[] => {
  const counts = new Map<string, number>();
  events.forEach((e) => {
    const country = countryOf(e.place);
    counts.set(country, (counts.get(country) || 0) + 1);
  });
  return [...counts.entries()].filter(([x]) => x !== 'Not listed').sort((a, b) => b[1] - a[1]).slice(0, 7)
    .map(([label, value]) => ({ label, value, color: '#34d399' }));
};

export const timelineRows = (events: Earthquake[]): Row[] => {
  const counts = new Map<string, number>();
  events.forEach((e) => {
    const parsed = Date.parse(e.time);
    if (!Number.isFinite(parsed)) return;
    const key = new Date(parsed).toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, value]) => ({
      label: new Date(`${date}T00:00:00Z`).toLocaleDateString('en', { month: 'short', day: '2-digit', timeZone: 'UTC' }),
      value,
      color: '#f59e0b',
    }));
};

export const scatterPoints = (events: Earthquake[]): Point[] =>
  events.filter((e) => Number.isFinite(e.depth) && Number.isFinite(e.magnitude)).slice(0, 120).map((e) => ({
    x: e.depth,
    y: e.magnitude,
    label: e.place,
    color: e.magnitude >= 6 ? '#f43f5e' : e.depth <= 70 ? '#f59e0b' : '#38bdf8',
  }));
