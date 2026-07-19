import { Earthquake, SeismicFilters } from '../types';
import { filterAndSortEarthquakes, filterHistoricalByQuery } from './earthquakeFilters';
import { EARTHQUAKE_API_URL, buildHistoricalQuery, buildLiveQuery } from './usgsParams';
import { assertFeatureCollection, mapFeatureToEarthquake } from './usgsTransformers';

export const fetchEarthquakes = async (filters: SeismicFilters): Promise<Earthquake[]> => {
  const queryParams = buildLiveQuery(filters);
  const response = await fetch(`${EARTHQUAKE_API_URL}?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Earthquake data request failed with status ${response.status}`);
  }

  const data = await response.json();
  assertFeatureCollection(data, 'Earthquake data');
  return filterAndSortEarthquakes(data.features.map(mapFeatureToEarthquake), filters);
};

export const fetchHistoricalEarthquakes = async (params: {
  startDate: string;
  endDate: string;
  minMagnitude: number;
  maxMagnitude?: number;
  query?: string;
}): Promise<Earthquake[]> => {
  const queryParams = buildHistoricalQuery(params);
  const response = await fetch(`${EARTHQUAKE_API_URL}?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Historical data request failed with status ${response.status}`);
  }

  const data = await response.json();
  assertFeatureCollection(data, 'Historical data');
  const events = data.features.map(mapFeatureToEarthquake);
  return filterHistoricalByQuery(events, params.query);
};
