import type { AnalyticsBackfillDryRunReport, AnalyticsBackfillPlan } from '../../types/analyticsBackfillPlan';
import { validateAnalyticsBackfillPlan } from './analyticsBackfillPlanner';

const intervalSummary = (interval: AnalyticsBackfillPlan['firstInterval']) => ({
  key: interval.intervalKey,
  startDate: interval.startDateIso,
  endDate: interval.endDateIso,
});

export function createAnalyticsBackfillDryRunReport(plan: AnalyticsBackfillPlan): AnalyticsBackfillDryRunReport {
  validateAnalyticsBackfillPlan(plan);
  const warnings = [
    'The plan has not been validated against USGS response sizes.',
    'No earthquake data was fetched during this dry run.',
    'No MongoDB documents were created or modified.',
  ];
  if (plan.region === 'pakistan') {
    warnings.push('Pakistan requests currently use a broad bounding box and do not provide final country classification.');
  }
  return {
    mode: 'dry-run',
    jobKey: plan.jobKey,
    region: plan.region,
    requestedRange: {
      startDate: plan.requestedStartDate.toISOString(),
      endDate: plan.requestedEndDate.toISOString(),
    },
    filters: {
      minMagnitude: plan.minMagnitude,
      maxMagnitude: plan.maxMagnitude,
      minDepth: plan.minDepth,
      maxDepth: plan.maxDepth,
    },
    granularity: plan.granularity,
    totalIntervals: plan.totalIntervals,
    firstInterval: intervalSummary(plan.firstInterval),
    finalInterval: intervalSummary(plan.finalInterval),
    partialBoundaryIntervals: plan.intervals.filter((interval) => interval.risk === 'partial-boundary').length,
    largeDateSpanIntervals: plan.intervals.filter((interval) => interval.risk === 'large-date-span').length,
    networkRequestsExecuted: 0,
    earthquakeRecordsFetched: 0,
    databaseWritesExecuted: 0,
    warnings,
  };
}

