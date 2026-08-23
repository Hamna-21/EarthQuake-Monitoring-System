export type AnalyticsBackfillStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed';
export type AnalyticsBackfillRegion = 'pakistan' | 'global';
export type AnalyticsBackfillGranularity = 'year' | 'month';

export type AnalyticsBackfillError = {
  code: string;
  message: string;
  occurredAt: Date;
};

export type AnalyticsBackfillProgressDocument = {
  jobKey: string;
  region: AnalyticsBackfillRegion;
  startDate: Date;
  endDate: Date;
  minMagnitude: number;
  maxMagnitude: number | null;
  minDepth: number | null;
  maxDepth: number | null;
  granularity: AnalyticsBackfillGranularity;
  intervalPlanVersion: 1;
  status: AnalyticsBackfillStatus;
  totalIntervals: number;
  completedIntervals: number;
  nextIntervalStart: Date | null;
  lastCompletedIntervalEnd: Date | null;
  fetchedEventCount: number;
  normalizedEventCount: number;
  insertedEventCount: number;
  updatedEventCount: number;
  skippedEventCount: number;
  duplicateEventCount: number;
  lastError: AnalyticsBackfillError | null;
  revision: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
};

/** Types representing progress and status reported by analytics backfills. */
