export type AnalyticsIntervalSafety =
  | 'safe'
  | 'split-required'
  | 'zero-events'
  | 'minimum-size-unsafe'
  | 'unknown';

export type AnalyticsAdaptiveIntervalNode = {
  intervalKey: string;
  startDate: Date;
  endDate: Date;
  requestStartDate: Date;
  requestEndDate: Date;
  level: number;
  eventCount: number | null;
  safety: AnalyticsIntervalSafety;
  splitReason: string | null;
  children: AnalyticsAdaptiveIntervalNode[];
  countRequestExecuted: boolean;
  countDiscrepancy: number | null;
};

export type AnalyticsAdaptiveIntervalPlan = {
  mode: 'count-only';
  sourceIntervalKey: string;
  safeEventLimit: number;
  splitThreshold: number;
  maximumDepth: number;
  maximumRequests: number;
  countRequestsExecuted: number;
  eventRequestsExecuted: 0;
  databaseWritesExecuted: 0;
  root: AnalyticsAdaptiveIntervalNode;
  safeLeafIntervals: AnalyticsAdaptiveIntervalNode[];
  unsafeLeafIntervals: AnalyticsAdaptiveIntervalNode[];
  unknownLeafIntervals: AnalyticsAdaptiveIntervalNode[];
  totalReportedEventCount: number | null;
  requestBudgetExhausted: boolean;
  warnings: string[];
};
