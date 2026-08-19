import type { EarthquakeRecord } from './earthquakeService';

export const pakistanBoundary: Array<[number, number]> = [
  [61.0, 25.0], [61.4, 28.4], [62.4, 29.5], [64.0, 29.6],
  [65.6, 30.6], [67.3, 31.2], [68.3, 32.4], [69.4, 33.2],
  [70.4, 34.3], [71.2, 35.4], [72.4, 36.3], [73.8, 37.0],
  [75.2, 35.8], [77.8, 35.5], [76.9, 33.7], [75.2, 32.3],
  [74.1, 31.2], [74.7, 29.8], [72.3, 28.4], [70.2, 24.6],
  [67.5, 23.6], [65.0, 24.6], [62.5, 25.0], [61.0, 25.0],
];

// Use the shared [longitude, latitude] order for the local Pakistan boundary test.
export function pointInPolygon(lon: number, lat: number, polygon = pakistanBoundary) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const crosses = yi > lat !== yj > lat;
    const xAtLat = ((xj - xi) * (lat - yi)) / (yj - yi || Number.EPSILON) + xi;
    if (crosses && lon < xAtLat) inside = !inside;
  }
  return inside;
}

export function insidePakistan(event: EarthquakeRecord) {
  return pointInPolygon(event.longitude, event.latitude);
}
