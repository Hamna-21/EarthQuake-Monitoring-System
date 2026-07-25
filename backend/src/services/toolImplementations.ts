export async function getLatestEarthquakes(args: { minMagnitude?: number; limit?: number }) {
  try {
    const minMag = args.minMagnitude ?? 2.5;
    const limit = args.limit ?? 5;
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=${minMag}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('USGS fetch failed');
    const data: any = await response.json();
    return data.features.map((f: any) => ({
      place: f.properties.place,
      magnitude: f.properties.mag,
      time: new Date(f.properties.time).toISOString(),
      depthKm: f.geometry.coordinates[2]
    }));
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
