import { Earthquake, SeismicFilters } from '../types';

const getTimeRangeParams = (timeframe: string): { starttime: string } => {
  const now = new Date();
  let msAgo = 24 * 60 * 60 * 1000;

  if (timeframe === '7d') {
    msAgo = 7 * 24 * 60 * 60 * 1000;
  } else if (timeframe === '30d') {
    msAgo = 30 * 24 * 60 * 60 * 1000;
  }

  return {
    starttime: new Date(now.getTime() - msAgo).toISOString()
  };
};

export const fetchEarthquakes = async (filters: SeismicFilters): Promise<Earthquake[]> => {
  const { starttime } = getTimeRangeParams(filters.timeframe);

  const queryParams = new URLSearchParams({
    format: 'geojson',
    starttime,
    minmagnitude: filters.minMagnitude.toString(),
    limit: '150',
    orderby: 'time'
  });

  const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`USGS request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.features || !Array.isArray(data.features)) {
    throw new Error('USGS returned an invalid GeoJSON response');
  }

  const mappedEarthquakes = data.features.map((feat: any): Earthquake => {
    const properties = feat.properties ?? {};
    const coordinates = feat.geometry?.coordinates ?? [];

    return {
      id: feat.id,
      magnitude: properties.mag ?? 0,
      place: properties.place || 'Unknown location',
      time: properties.time ?? 0,
      updated: properties.updated ?? 0,
      url: properties.url || '',
      detail: properties.detail || '',
      felt: properties.felt ?? null,
      cdi: properties.cdi ?? null,
      mmi: properties.mmi ?? null,
      alert: properties.alert as 'green' | 'yellow' | 'orange' | 'red' | null,
      status: properties.status || 'unknown',
      tsunami: properties.tsunami ?? 0,
      sig: properties.sig ?? 0,
      longitude: coordinates[0] ?? 0,
      latitude: coordinates[1] ?? 0,
      depth: coordinates[2] ?? 0,
      magType: properties.magType || 'unknown'
    };
  });

  return filterAndSortEarthquakes(mappedEarthquakes, filters);
};

export const fetchHistoricalEarthquakes = async (params: {
  startDate: string;
  endDate: string;
  minMagnitude: number;
  maxMagnitude?: number;
  query?: string;
}): Promise<Earthquake[]> => {
  const queryParams = new URLSearchParams({
    format: 'geojson',
    starttime: params.startDate,
    endtime: params.endDate,
    minmagnitude: params.minMagnitude.toString(),
    limit: '20000',
    orderby: 'time'
  });

  if (params.maxMagnitude !== undefined) {
    queryParams.set('maxmagnitude', params.maxMagnitude.toString());
  }

  const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?${queryParams.toString()}`);
  if (!response.ok) throw new Error(`USGS historical request failed with status ${response.status}`);
  const data = await response.json();
  if (!data.features || !Array.isArray(data.features)) throw new Error('USGS returned an invalid historical response');

  const events = data.features.map((feat: any): Earthquake => {
    const p = feat.properties ?? {};
    const c = feat.geometry?.coordinates ?? [];
    return {
      id: feat.id,
      magnitude: p.mag ?? 0,
      place: p.place || 'Unknown location',
      time: p.time ?? 0,
      updated: p.updated ?? 0,
      url: p.url || '',
      detail: p.detail || '',
      felt: p.felt ?? null,
      cdi: p.cdi ?? null,
      mmi: p.mmi ?? null,
      alert: p.alert as 'green' | 'yellow' | 'orange' | 'red' | null,
      status: p.status || 'unknown',
      tsunami: p.tsunami ?? 0,
      sig: p.sig ?? 0,
      longitude: c[0] ?? 0,
      latitude: c[1] ?? 0,
      depth: c[2] ?? 0,
      magType: p.magType || 'unknown'
    };
  });

if (!params.query || params.query.trim() === "") {
  return events;
}

const search = params.query.toLowerCase().trim();

return events.filter((event: Earthquake) => {
  const place = (event.place ?? "").toLowerCase();
  return place.includes(search);
});
};

const filterAndSortEarthquakes = (quakes: Earthquake[], filters: SeismicFilters): Earthquake[] => {
  let result = [...quakes];

  result = result.filter((quake) => quake.magnitude >= filters.minMagnitude);

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (filters.timeframe === '24h') {
    result = result.filter((quake) => now - quake.time <= oneDay);
  } else if (filters.timeframe === '7d') {
    result = result.filter((quake) => now - quake.time <= 7 * oneDay);
  } else if (filters.timeframe === '30d') {
    result = result.filter((quake) => now - quake.time <= 30 * oneDay);
  }

  if (filters.alertClass === 'yellow') {
    result = result.filter((quake) => quake.alert === 'yellow' || quake.alert === 'orange' || quake.alert === 'red' || quake.magnitude >= 5);
  } else if (filters.alertClass === 'red') {
    result = result.filter((quake) => quake.alert === 'red' || quake.magnitude >= 6.5);
  }

  if (filters.region.trim()) {
    const search = filters.region.toLowerCase().trim();
    result = result.filter((quake) => quake.place.toLowerCase().includes(search));
  }

  return result.sort((a, b) => b.time - a.time);
};
