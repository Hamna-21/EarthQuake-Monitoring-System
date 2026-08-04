import type { Db } from 'mongodb';
import type { AnalyticsBackfillProgressDocument } from '../../types/analyticsBackfillProgress';
import { createAnalyticsEarthquakeRepository } from '../../repositories/analyticsEarthquakeRepository';
import { createAnalyticsBackfillProgressRepository } from '../../repositories/analyticsBackfillProgressRepository';
import { createAnalyticsBackfillPlan } from './analyticsBackfillPlanner';
import { createAnalyticsBackfillResumePlan } from './analyticsBackfillResumePlanner';
import { createInitialBackfillProgress, createAnalyticsBackfillJobKey } from './analyticsBackfillProgress';
import { initializeAnalyticsStorage } from './initializeAnalyticsStorage';
import { createUsgsRequestForPlannedInterval } from './analyticsIntervalRequest';
import { fetchUsgsAnalyticsCount } from './usgsAnalyticsCountClient';
import { fetchAnalyticsInterval, MAX_USGS_ANALYTICS_EVENT_LIMIT } from './usgsAnalyticsClient';
import { toAnalyticsEarthquakeDocument } from './analyticsEarthquakeDocumentMapper';

export type AnalyticsBackfillRunOptions = {
  dryRun?: boolean; runAll?: boolean; resume?: boolean; maxIntervals?: number; now?: Date;
  onInterval?: (line: string) => void;
};

const startDate = new Date('1975-01-01T00:00:00.000Z');
const threshold = 16000;
const input = (endDate: Date) => ({
  region: 'pakistan' as const, startDate, endDate, minMagnitude: 4,
  maxMagnitude: null, minDepth: null, maxDepth: null, granularity: 'year' as const,
});
const safeError = (error: unknown) => ({
  code: error instanceof Error ? error.name || 'BACKFILL_ERROR' : 'BACKFILL_ERROR',
  message: error instanceof Error ? error.message.slice(0, 300) : 'Backfill failed.',
  occurredAt: new Date(),
});

async function stablePlan(db: Db, now: Date) {
  const progressRepo = createAnalyticsBackfillProgressRepository(db);
  const draft = input(now);
  const existing = await progressRepo.findByJobKey(createAnalyticsBackfillJobKey(draft));
  const planInput = input(existing?.endDate ?? now);
  return { plan: createAnalyticsBackfillPlan(planInput, now), progressRepo };
}

async function ensureProgress(db: Db, now: Date) {
  const { plan, progressRepo } = await stablePlan(db, now);
  const initial = createInitialBackfillProgress(input(plan.requestedEndDate), now);
  await progressRepo.createIfMissing(initial);
  const progress = await progressRepo.findByJobKey(plan.jobKey);
  if (!progress) throw new Error('Backfill progress was not created.');
  return { plan, progressRepo, progress };
}

async function markRunning(progressRepo: ReturnType<typeof createAnalyticsBackfillProgressRepository>, progress: AnalyticsBackfillProgressDocument) {
  if (progress.status === 'completed' || progress.status === 'running') return progress;
  await progressRepo.markStatus(progress.jobKey, progress.revision, { status: 'running', updatedAt: new Date() });
  const updated = await progressRepo.findByJobKey(progress.jobKey);
  if (!updated) throw new Error('Progress disappeared after running transition.');
  return updated;
}

export async function runPakistanAnalyticsBackfill(db: Db, options: AnalyticsBackfillRunOptions = {}) {
  const now = options.now ?? new Date();
  const dryRun = options.dryRun || (!options.runAll && options.maxIntervals === undefined);
  if (dryRun) {
    const { plan, progressRepo } = await stablePlan(db, now);
    return { mode: 'dry-run' as const, plan, progress: await progressRepo.findByJobKey(plan.jobKey), completedThisRun: 0, fetched: 0, inserted: 0, updated: 0, skipped: 0 };
  }
  const { plan, progressRepo, progress: originalProgress } = await ensureProgress(db, now);
  await initializeAnalyticsStorage(db);
  const earthquakeRepo = createAnalyticsEarthquakeRepository(db);
  let progress = await markRunning(progressRepo, originalProgress);
  const resume = createAnalyticsBackfillResumePlan(plan, progress);
  let completedThisRun = 0, fetched = 0, inserted = 0, updated = 0, skipped = 0;
  const limit = options.maxIntervals ?? Number.POSITIVE_INFINITY;
  for (const interval of resume.remainingPlan) {
    if (completedThisRun >= limit) break;
    const request = createUsgsRequestForPlannedInterval(interval);
    try {
      const count = await fetchUsgsAnalyticsCount({ region: 'pakistan', startDate: request.requestStartDate, endDate: request.requestEndDate, minMagnitude: 4, maxMagnitude: null, minDepth: null, maxDepth: null });
      if (count.count > threshold) throw new Error(`Interval exceeds safe threshold: ${count.count}/${threshold}`);
      const response = await fetchAnalyticsInterval({ region: 'pakistan', startDate: request.requestStartDate, endDate: request.requestEndDate, minMagnitude: 4, maxMagnitude: null, minDepth: null, maxDepth: null, limit: MAX_USGS_ANALYTICS_EVENT_LIMIT });
      const documents = response.events.map((event) => toAnalyticsEarthquakeDocument(event, new Date()));
      const result = await earthquakeRepo.bulkUpsert(documents);
      fetched += response.returnedFeatureCount; inserted += result.upsertedCount; updated += result.matchedCount; skipped += response.skippedFeatureCount;
      const completed = progress.completedIntervals + 1, next = completed >= plan.totalIntervals ? null : plan.intervals[completed].startDate;
      await progressRepo.updateCheckpoint(progress.jobKey, progress.revision, {
        completedIntervals: completed, nextIntervalStart: next, lastCompletedIntervalEnd: interval.endDate,
        fetchedEventCount: progress.fetchedEventCount + response.returnedFeatureCount,
        normalizedEventCount: progress.normalizedEventCount + response.events.length,
        insertedEventCount: progress.insertedEventCount + result.upsertedCount,
        updatedEventCount: progress.updatedEventCount + result.matchedCount,
        skippedEventCount: progress.skippedEventCount + response.skippedFeatureCount,
        duplicateEventCount: progress.duplicateEventCount + response.duplicateIds.length, updatedAt: new Date(),
      });
      progress = (await progressRepo.findByJobKey(progress.jobKey))!; completedThisRun += 1;
      options.onInterval?.(`${interval.startDate.getUTCFullYear()} | ${response.returnedFeatureCount} | ${result.upsertedCount} | ${result.matchedCount} | ${response.skippedFeatureCount}`);
    } catch (error) {
      await progressRepo.markStatus(progress.jobKey, progress.revision, { status: 'failed', updatedAt: new Date(), error: safeError(error) });
      throw error;
    }
  }
  if (progress.completedIntervals === plan.totalIntervals) await progressRepo.markStatus(progress.jobKey, progress.revision, { status: 'completed', updatedAt: new Date(), completedAt: new Date() });
  else if (completedThisRun >= limit) await progressRepo.markStatus(progress.jobKey, progress.revision, { status: 'paused', updatedAt: new Date() });
  const finalProgress = await progressRepo.findByJobKey(progress.jobKey);
  return { mode: 'run' as const, plan, progress: finalProgress, completedThisRun, fetched, inserted, updated, skipped };
}
