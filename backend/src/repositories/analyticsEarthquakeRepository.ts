import type { Db, Filter } from 'mongodb';
import type { AnalyticsEarthquakeDocument } from '../types/analyticsEarthquakeDocument';
import { validateAnalyticsEarthquakeDocument } from '../services/analytics/analyticsEarthquakeDocumentMapper';

export const ANALYTICS_EARTHQUAKE_COLLECTION = 'analytics_earthquakes';

export class AnalyticsEarthquakeRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalyticsEarthquakeRepositoryError';
  }
}

function validateId(usgsId: string) {
  if (!usgsId.trim()) throw new AnalyticsEarthquakeRepositoryError('USGS ID is required.');
}

function writableFields(document: AnalyticsEarthquakeDocument) {
  const { createdAt, ...fields } = document;
  return fields;
}

function assertUniqueBatch(documents: readonly AnalyticsEarthquakeDocument[]) {
  const seen = new Set<string>();
  for (const document of documents) {
    validateAnalyticsEarthquakeDocument(document);
    if (seen.has(document.usgsId)) {
      throw new AnalyticsEarthquakeRepositoryError(`Duplicate USGS ID in bulk batch: ${document.usgsId}`);
    }
    seen.add(document.usgsId);
  }
}

// Provide validated, indexed MongoDB access for analytics documents and idempotent upserts.
export function createAnalyticsEarthquakeRepository(
  db: Db,
  collectionName = ANALYTICS_EARTHQUAKE_COLLECTION,
) {
  const collection = db.collection<AnalyticsEarthquakeDocument>(collectionName);

  return {
    ensureIndexes: () => collection.createIndexes([
      { key: { usgsId: 1 }, unique: true, name: 'usgs_id_unique' },
      { key: { occurredAt: 1 }, name: 'occurred_at_ascending' },
      { key: { location: '2dsphere' }, name: 'location_2dsphere' },
      { key: { classificationMethod: 1, occurredAt: 1 }, name: 'classification_time' },
    ]),

    findByUsgsId(usgsId: string) {
      validateId(usgsId);
      return collection.findOne({ usgsId });
    },

    async upsertOne(document: AnalyticsEarthquakeDocument) {
      validateAnalyticsEarthquakeDocument(document);
      const result = await collection.updateOne(
        { usgsId: document.usgsId },
        { $set: writableFields(document), $setOnInsert: { createdAt: document.createdAt } },
        { upsert: true },
      );
      return { inserted: result.upsertedCount > 0, updated: result.matchedCount > 0 && result.modifiedCount > 0 };
    },

    async bulkUpsert(documents: readonly AnalyticsEarthquakeDocument[]) {
      if (!documents.length) return { matchedCount: 0, modifiedCount: 0, upsertedCount: 0 };
      assertUniqueBatch(documents);
      const result = await collection.bulkWrite(documents.map((document) => ({
        updateOne: {
          filter: { usgsId: document.usgsId },
          update: { $set: writableFields(document), $setOnInsert: { createdAt: document.createdAt } },
          upsert: true,
        },
      })), { ordered: false });
      return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount,
      };
    },

    countDocuments(filter: Filter<AnalyticsEarthquakeDocument> = {}) {
      return collection.countDocuments(filter);
    },
  };
}

