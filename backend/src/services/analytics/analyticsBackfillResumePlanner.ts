import type { AnalyticsBackfillPlan, AnalyticsBackfillResumePlan } from '../../types/analyticsBackfillPlan';
import type { AnalyticsBackfillProgressDocument } from '../../types/analyticsBackfillProgress';
import { validateAnalyticsBackfillProgress } from './analyticsBackfillProgress';
import { AnalyticsBackfillPlanError, validateAnalyticsBackfillPlan } from './analyticsBackfillPlanner';

const fail = (message: string): never => { throw new AnalyticsBackfillPlanError(message); };
const sameTime = (left: Date | null, right: Date | null) => left?.getTime() === right?.getTime();

function requireSameConfig(plan: AnalyticsBackfillPlan, progress: AnalyticsBackfillProgressDocument) {
  if (plan.jobKey !== progress.jobKey) fail('Progress belongs to a different backfill job.');
  if (plan.region !== progress.region || plan.granularity !== progress.granularity) fail('Progress region or granularity does not match the plan.');
  if (!sameTime(plan.requestedStartDate, progress.startDate) || !sameTime(plan.requestedEndDate, progress.endDate)) fail('Progress date range does not match the plan.');
  if (
    plan.minMagnitude !== progress.minMagnitude || plan.maxMagnitude !== progress.maxMagnitude ||
    plan.minDepth !== progress.minDepth || plan.maxDepth !== progress.maxDepth
  ) fail('Progress scientific filters do not match the plan.');
  if (plan.totalIntervals !== progress.totalIntervals) fail('Progress interval count does not match the plan.');
}

export function createAnalyticsBackfillResumePlan(
  plan: AnalyticsBackfillPlan,
  progress: AnalyticsBackfillProgressDocument,
): AnalyticsBackfillResumePlan {
  validateAnalyticsBackfillPlan(plan);
  validateAnalyticsBackfillProgress(progress);
  requireSameConfig(plan, progress);
  if (progress.completedIntervals > plan.intervals.length) fail('Progress has more completed intervals than the plan.');
  const complete = progress.completedIntervals === plan.intervals.length;
  const next = complete ? null : plan.intervals[progress.completedIntervals];
  if (complete && progress.nextIntervalStart !== null) fail('Completed progress must not have a next interval start.');
  if (!complete && !sameTime(progress.nextIntervalStart, next.startDate)) fail('Progress nextIntervalStart does not match the next planned interval.');
  const remainingPlan = complete ? [] : plan.intervals.slice(progress.completedIntervals).map((interval) => ({ ...interval }));
  return {
    jobKey: plan.jobKey,
    originalTotalIntervals: plan.totalIntervals,
    completedIntervals: progress.completedIntervals,
    remainingIntervals: remainingPlan.length,
    nextInterval: next ? { ...next } : null,
    remainingPlan,
    isComplete: complete,
  };
}

