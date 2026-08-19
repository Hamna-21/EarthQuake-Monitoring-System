import type { Db, Filter } from 'mongodb';
import type { AnalyticsBackfillError, AnalyticsBackfillProgressDocument, AnalyticsBackfillStatus } from '../types/analyticsBackfillProgress';
import { validateAnalyticsBackfillProgress } from '../services/analytics/analyticsBackfillProgress';

export const ANALYTICS_BACKFILL_PROGRESS_COLLECTION = 'analytics_backfill_progress';

export type AnalyticsBackfillCheckpoint = Pick<AnalyticsBackfillProgressDocument,
  'completedIntervals' | 'nextIntervalStart' | 'lastCompletedIntervalEnd' | 'fetchedEventCount' |
  'normalizedEventCount' | 'insertedEventCount' | 'updatedEventCount' | 'skippedEventCount' |
  'duplicateEventCount' | 'updatedAt'>;

export type AnalyticsBackfillStatusUpdate = {
  status: AnalyticsBackfillStatus;
  updatedAt: Date;
  error?: AnalyticsBackfillError | null;
  completedAt?: Date;
};

export class AnalyticsBackfillProgressRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalyticsBackfillProgressRepositoryError';
  }
}

const transitions: Record<AnalyticsBackfillStatus, AnalyticsBackfillStatus[]> = {
  pending: ['running'], running: ['paused', 'failed', 'completed'],
  paused: ['running', 'failed'], failed: ['running'], completed: [],
};

const validRevision = (revision: number) => Number.isInteger(revision) && revision >= 0;
const requireKey = (jobKey: string) => jobKey.trim() || fail('jobKey is required.');
const fail = (message: string): never => { throw new AnalyticsBackfillProgressRepositoryError(message); };

function configOf(document: AnalyticsBackfillProgressDocument) {
  return JSON.stringify({
    region: document.region, startDate: document.startDate.toISOString(), endDate: document.endDate.toISOString(),
    minMagnitude: document.minMagnitude, maxMagnitude: document.maxMagnitude,
    minDepth: document.minDepth, maxDepth: document.maxDepth, granularity: document.granularity,
  });
}

// Persist resumable backfill checkpoints with revision checks and explicit status transitions.
export function createAnalyticsBackfillProgressRepository(
  db: Db,
  collectionName = ANALYTICS_BACKFILL_PROGRESS_COLLECTION,
) {
  const collection = db.collection<AnalyticsBackfillProgressDocument>(collectionName);
  const current = (jobKey: string, revision: number) => {
    requireKey(jobKey);
    if (!validRevision(revision)) fail('expectedRevision must be a non-negative integer.');
    return collection.findOne({ jobKey, revision });
  };

  return {
    ensureIndexes: () => collection.createIndexes([
      { key: { jobKey: 1 }, unique: true, name: 'job_key_unique' },
      { key: { status: 1, updatedAt: -1 }, name: 'status_updated_at' },
      { key: { region: 1, startDate: 1, endDate: 1 }, name: 'region_date_range' },
    ]),

    findByJobKey(jobKey: string) {
      requireKey(jobKey);
      return collection.findOne({ jobKey });
    },

    async createIfMissing(document: AnalyticsBackfillProgressDocument) {
      validateAnalyticsBackfillProgress(document);
      const result = await collection.updateOne({ jobKey: document.jobKey }, { $setOnInsert: document }, { upsert: true });
      if (result.upsertedCount) return { created: true };
      const existing = await collection.findOne({ jobKey: document.jobKey });
      if (!existing || configOf(existing) !== configOf(document)) fail('Existing backfill job has incompatible configuration.');
      return { created: false };
    },

    async updateCheckpoint(jobKey: string, expectedRevision: number, checkpoint: AnalyticsBackfillCheckpoint) {
      const existing = await current(jobKey, expectedRevision);
      if (!existing) return { updated: false, revision: null };
      const candidate = { ...existing, ...checkpoint, revision: expectedRevision + 1 };
      validateAnalyticsBackfillProgress(candidate);
      const result = await collection.updateOne({ jobKey, revision: expectedRevision }, { $set: checkpoint, $inc: { revision: 1 } });
      return { updated: result.matchedCount > 0, revision: result.matchedCount ? expectedRevision + 1 : null };
    },

    async markStatus(jobKey: string, expectedRevision: number, update: AnalyticsBackfillStatusUpdate) {
      const existing = await current(jobKey, expectedRevision);
      if (!existing) return { updated: false, revision: null };
      if (!transitions[existing.status].includes(update.status)) fail(`Invalid status transition: ${existing.status} to ${update.status}.`);
      const $set: Partial<AnalyticsBackfillProgressDocument> = { status: update.status, updatedAt: update.updatedAt };
      if (update.status === 'running') { $set.startedAt = existing.startedAt ?? update.updatedAt; $set.lastError = null; }
      if (update.status === 'paused') $set.lastError = existing.lastError;
      if (update.status === 'failed') { if (!update.error) fail('Failed status requires a safe error.'); $set.lastError = update.error; }
      if (update.status === 'completed') {
        if (existing.completedIntervals !== existing.totalIntervals || existing.nextIntervalStart !== null) fail('Cannot complete before all intervals finish.');
        $set.completedAt = update.completedAt ?? update.updatedAt;
      }
      validateAnalyticsBackfillProgress({ ...existing, ...$set, revision: expectedRevision + 1 });
      const result = await collection.updateOne({ jobKey, revision: expectedRevision }, { $set, $inc: { revision: 1 } });
      return { updated: result.matchedCount > 0, revision: result.matchedCount ? expectedRevision + 1 : null };
    },

    countDocuments(filter: Filter<AnalyticsBackfillProgressDocument> = {}) {
      return collection.countDocuments(filter);
    },
  };
}

