import type { Db } from 'mongodb';
import { ANALYTICS_EARTHQUAKE_COLLECTION, createAnalyticsEarthquakeRepository } from '../../repositories/analyticsEarthquakeRepository';
import { ANALYTICS_BACKFILL_PROGRESS_COLLECTION, createAnalyticsBackfillProgressRepository } from '../../repositories/analyticsBackfillProgressRepository';

export type AnalyticsStorageCollectionResult = {
  name: string;
  documentCount: number;
  indexNames: string[];
};

export type AnalyticsStorageInitializationResult = {
  earthquakeCollection: AnalyticsStorageCollectionResult;
  progressCollection: AnalyticsStorageCollectionResult;
};

async function collectionResult(db: Db, name: string): Promise<AnalyticsStorageCollectionResult> {
  const collection = db.collection(name);
  const indexes = await collection.indexes();
  return {
    name,
    documentCount: await collection.countDocuments({}),
    indexNames: indexes.map((index) => String(index.name)).sort(),
  };
}

export async function initializeAnalyticsStorage(db: Db): Promise<AnalyticsStorageInitializationResult> {
  // Create analytics collections and indexes before dashboard queries or backfills use MongoDB.
  await createAnalyticsEarthquakeRepository(db).ensureIndexes();
  await createAnalyticsBackfillProgressRepository(db).ensureIndexes();
  return {
    earthquakeCollection: await collectionResult(db, ANALYTICS_EARTHQUAKE_COLLECTION),
    progressCollection: await collectionResult(db, ANALYTICS_BACKFILL_PROGRESS_COLLECTION),
  };
}

