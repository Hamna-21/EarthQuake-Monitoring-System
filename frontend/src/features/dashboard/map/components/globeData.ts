import type { Earthquake } from '@/types';
import earthSatellite from '@/assets/images/earth/earth-satellite-2048.jpg';
import earthDay from '@/assets/images/earth/earth-day.jpg';
import earthNight from '@/assets/images/earth/earth-night-2048.jpg';
import earthTopology from '@/assets/images/earth/earth-topology.png';

export type View = 'satellite' | 'terrain' | 'night';
export const countryLabels = [
  { text: 'Pakistan', lat: 33.701942, lng: 73.164689 },
  { text: 'Kyrgyzstan', lat: 42.875025, lng: 74.583258 },
  { text: 'Romania', lat: 44.4268, lng: 26.1025 },
  { text: 'Japan', lat: 35.686963, lng: 139.749462 },
  { text: 'Indonesia', lat: -6.172472, lng: 106.827492 },
  { text: 'Turkey', lat: 39.929184, lng: 32.862446 },
  { text: 'Chile', lat: -33.448068, lng: -70.668987 },
  { text: 'United States', lat: 33.991924, lng: -118.181926 },
];
export const countryColors = ['#14b8a6', '#38bdf8', '#2563eb', '#7c3aed', '#f59e0b', '#f97316', '#ef4444', '#22c55e'];
export const groundTruthCoordinates = [
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { name: 'Bucharest', lat: 44.4268, lng: 26.1025 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Santiago', lat: -33.4489, lng: -70.6693 },
];

const countryAliases: Record<string, string> = {
  usa: 'united states',
  'united states of america': 'united states',
  uk: 'united kingdom',
  'great britain': 'united kingdom',
};

export function uniqueCountryLabels(labels: Array<{ text: string; lat: number; lng: number }>) {
  const unique = new Map<string, { text: string; lat: number; lng: number }>();
  labels.forEach((label) => {
    const normalized = label.text.trim().toLowerCase().replace(/\s+/g, ' ');
    const key = countryAliases[normalized] ?? normalized;
    if (key && !unique.has(key)) unique.set(key, label);
  });
  return [...unique.values()];
}

// Select stable local assets for each globe mode; terrain adds a bump map while night uses a separate night texture.
export function globeAssets(view: View) {
  return {
    image: view === 'night' ? earthNight : view === 'terrain' ? earthDay : earthSatellite,
    bump: view === 'terrain' ? earthTopology : undefined,
  };
}

// Reject invalid coordinates before they reach the 3D renderer or its popup positioning logic.
export function validEvents(events: Earthquake[]) {
  const unique = new Map<string, Earthquake>();
  events.forEach((event) => {
    if (!Number.isFinite(event.latitude) || !Number.isFinite(event.longitude) || event.latitude < -90 || event.latitude > 90 || event.longitude < -180 || event.longitude > 180) return;
    const key = event.id || `${event.time}:${event.latitude}:${event.longitude}`;
    if (!unique.has(key)) unique.set(key, event);
  });
  return [...unique.values()];
}
