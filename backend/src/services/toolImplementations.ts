import type { Earthquake } from '../types/earthquake';

type UsgsFeature = {
  id: string;
  properties: Record<string, any>;
  geometry: { coordinates: number[] };
};

const mapFeatureToEarthquake = (f: UsgsFeature): Earthquake => ({
  id: f.id,
  place: f.properties.place ?? 'Unknown location',
  magnitude: Number(f.properties.mag ?? 0),
  time: new Date(Number(f.properties.time)).toISOString(),
  updatedAt: new Date(Number(f.properties.updated ?? f.properties.time)).toISOString(),
  depth: Number(f.geometry.coordinates[2]),
  latitude: Number(f.geometry.coordinates[1]),
  longitude: Number(f.geometry.coordinates[0]),
  alert: ['green', 'yellow', 'orange', 'red'].includes(f.properties.alert) ? f.properties.alert : null,
  tsunami: f.properties.tsunami === 1,
  felt: f.properties.felt ?? null,
  status: f.properties.status ?? 'unknown',
  source: 'USGS',
  detailUrl: f.properties.detail ?? f.properties.url,
});

// Supply GeoBot with a small, normalized live-earthquake result set from the provider API.
export async function getLatestEarthquakes(args: { minMagnitude?: number; limit?: number }) {
  try {
    const minMag = args.minMagnitude ?? 2.5;
    const limit = args.limit ?? 5;
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=${minMag}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('USGS fetch failed');
    const data: any = await response.json();
    return data.features.map(mapFeatureToEarthquake);
  } catch (err) {
    return { error: 'Failed to fetch latest earthquakes from USGS' };
  }
}

export function getSafetyGuide(args: { phase: 'before' | 'during' | 'after' | 'all' }) {
  const phase = args.phase;
  const guides = {
    before: 'BEFORE: Secure heavy items (bookshelves, TVs). Prepare an emergency kit (water, food, flashlight). Create a family plan.',
    during: 'DURING: Drop, Cover, and Hold on. Stay away from glass, windows, outside walls. Do not use elevators.',
    after: 'AFTER: Check for injuries. Check gas lines for leaks. Expect aftershocks. Listen to emergency broadcasts.',
    all: 'BEFORE: Secure items, prep kit. DURING: Drop, Cover, Hold. AFTER: Check gas, expect aftershocks, stay alert.'
  };
  return { guide: guides[phase] || guides.all };
}

export async function getDashboardStatistics() {
  try {
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=50`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('USGS failed');
    const data: any = await response.json();
    const mags = data.features.map((f: any) => f.properties.mag).filter((m: any) => m !== null);
    const avgMag = mags.reduce((a: number, b: number) => a + b, 0) / mags.length;
    return {
      totalMonitoredRecent: data.features.length,
      averageMagnitude: parseFloat(avgMag.toFixed(2)),
      maxMagnitude: Math.max(...mags),
      status: 'Normal monitoring status'
    };
  } catch (err) {
    return { error: 'Failed to gather dashboard statistics' };
  }
}
