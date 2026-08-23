import type { AnalyticsBackfillGranularity, AnalyticsBackfillProgressDocument, AnalyticsBackfillRegion } from './analyticsBackfillProgress';

export type AnalyticsBackfillIntervalRisk = 'standard' | 'large-date-span' | 'partial-boundary';

export type AnalyticsBackfillPlanInterval = {
  index: number;
  intervalKey: string;
  startDate: Date;
  endDate: Date;
  startDateIso: string;
  endDateIso: string;
  durationDays: number;
  isFirst: boolean;
  isLast: boolean;
  isPartialBoundary: boolean;
  risk: AnalyticsBackfillIntervalRisk;
};

export type AnalyticsBackfillPlan = {
  planVersion: 1;
  jobKey: string;
  region: AnalyticsBackfillRegion;
  requestedStartDate: Date;
  requestedEndDate: Date;
  minMagnitude: number;
  maxMagnitude: number | null;
  minDepth: number | null;
  maxDepth: number | null;
  granularity: AnalyticsBackfillGranularity;
  generatedAt: Date;
  totalIntervals: number;
  intervals: AnalyticsBackfillPlanInterval[];
  firstInterval: AnalyticsBackfillPlanInterval;
  finalInterval: AnalyticsBackfillPlanInterval;
  estimatedTotalDays: number;
  networkRequestsPlanned: number;
  networkRequestsExecuted: 0;
  databaseWritesPlanned: number;
  databaseWritesExecuted: 0;
};

export type AnalyticsBackfillPlanInput = {
  region: AnalyticsBackfillRegion;
  startDate: Date;
  endDate: Date;
  minMagnitude: number;
  maxMagnitude: number | null;
  minDepth: number | null;
  maxDepth: number | null;
  granularity: AnalyticsBackfillGranularity;
};

export type AnalyticsBackfillResumePlan = {
  jobKey: string;
  originalTotalIntervals: number;
  completedIntervals: number;
  remainingIntervals: number;
  nextInterval: AnalyticsBackfillPlanInterval | null;
  remainingPlan: AnalyticsBackfillPlanInterval[];
  isComplete: boolean;
};

export type AnalyticsBackfillDryRunReport = {
  mode: 'dry-run';
  jobKey: string;
  region: AnalyticsBackfillRegion;
  requestedRange: { startDate: string; endDate: string };
  filters: Pick<AnalyticsBackfillProgressDocument, 'minMagnitude' | 'maxMagnitude' | 'minDepth' | 'maxDepth'>;
  granularity: AnalyticsBackfillGranularity;
  totalIntervals: number;
  firstInterval: { key: string; startDate: string; endDate: string };
  finalInterval: { key: string; startDate: string; endDate: string };
  partialBoundaryIntervals: number;
  largeDateSpanIntervals: number;
  networkRequestsExecuted: 0;
  earthquakeRecordsFetched: 0;
  databaseWritesExecuted: 0;
  warnings: string[];
};

/** Types for validated analytics backfill intervals and their processing risk. */
