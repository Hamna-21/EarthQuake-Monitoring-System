import type { Earthquake } from '@/types';
import countryDataset from '@/assets/data/ne_110m_admin_0_countries.json';
import earthSatellite from '@/assets/images/earth/earth-satellite.jpg';
import earthDay from '@/assets/images/earth/earth-day.jpg';
import earthNight from '@/assets/images/earth/earth-night.jpg';
import earthTopology from '@/assets/images/earth/earth-topology.png';

export type View = 'satellite' | 'terrain' | 'night';
export type CountryFeature = { properties: { ADMIN?: string; NAME?: string }; geometry: object };
export const countries = (countryDataset.features as CountryFeature[]).filter((feature) => feature.geometry);
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

export function globeAssets(view: View) {
  return {
    image: view === 'night' ? earthNight : view === 'terrain' ? earthDay : earthSatellite,
    bump: view === 'terrain' ? earthTopology : undefined,
  };
}

export function validEvents(events: Earthquake[]) {
  return events.filter((event) => Number.isFinite(event.latitude) && Number.isFinite(event.longitude)
    && event.latitude >= -90 && event.latitude <= 90 && event.longitude >= -180 && event.longitude <= 180);
}
