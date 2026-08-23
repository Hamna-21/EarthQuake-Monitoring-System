import type { EarthquakeAlert } from './earthquake';

// MongoDB's normalized analytics shape keeps provider metadata, GeoJSON coordinates, and classification state together.
export type AnalyticsEarthquakeClassification =
  | 'unclassified'
  | 'broad-bounding-box'
  | 'point-in-polygon';

export type AnalyticsEarthquakeDocument = {
  usgsId: string;
  magnitude: number | null;
  magnitudeType: string | null;
  place: string;
  occurredAt: Date;
  updatedAtUsgs: Date | null;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  depth: number | null;
  alert: EarthquakeAlert;
  tsunami: 0 | 1 | null;
  significance: number | null;
  status: string | null;
  source: 'USGS';
  sourceUrl: string | null;
  detailUrl: string | null;
  insidePakistan: boolean | null;
  classificationMethod: AnalyticsEarthquakeClassification;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

