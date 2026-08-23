import dotenv from 'dotenv';
import { getDb } from '../database/mongodb';
import { runPakistanAnalyticsBackfill } from '../services/analytics/analyticsBackfillRunner';

dotenv.config();

const args = new Set(process.argv.slice(2));
const maxArg = process.argv.slice(2).find((arg) => arg.startsWith('--max-intervals='));
const maxIntervals = maxArg ? Number(maxArg.split('=')[1]) : undefined;
const dryRun = args.has('--dry-run') || (!args.has('--run-all') && maxIntervals === undefined);

// CLI entry point for previewing, resuming, or running the MongoDB analytics backfill.
async function main() {
  if (maxIntervals !== undefined && (!Number.isInteger(maxIntervals) || maxIntervals < 1)) {
    throw new Error('--max-intervals must be a positive integer.');
  }
  const db = await getDb();
  if (!db) throw new Error('MongoDB is unavailable.');
  const result = await runPakistanAnalyticsBackfill(db, {
    dryRun,
    runAll: args.has('--run-all'),
    resume: args.has('--resume'),
    maxIntervals,
    onInterval: (line) => console.log(line),
  });
  console.log(JSON.stringify({
    mode: result.mode,
    completedThisRun: result.completedThisRun,
    fetched: result.fetched,
    inserted: result.inserted,
    updated: result.updated,
    skipped: result.skipped,
    progress: result.progress && {
      status: result.progress.status,
      completedIntervals: result.progress.completedIntervals,
      totalIntervals: result.progress.totalIntervals,
      fetchedEventCount: result.progress.fetchedEventCount,
      insertedEventCount: result.progress.insertedEventCount,
      updatedEventCount: result.progress.updatedEventCount,
      skippedEventCount: result.progress.skippedEventCount,
    },
  }));
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
