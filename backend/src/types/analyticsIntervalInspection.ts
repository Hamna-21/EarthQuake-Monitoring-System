import type { AnalyticsBackfillRegion } from './analyticsBackfillProgress';

export type AnalyticsIntervalInspection = {
  mode: 'read-only-inspection';
  intervalKey: string;
  request: {
    region: AnalyticsBackfillRegion;
    plannedStartDate: string;
    plannedEndDate: string;
    requestStartDate: string;
    requestEndDate: string;
    minMagnitude: number;
    maxMagnitude: number | null;
    minDepth: number | null;
    maxDepth: number | null;
  };
  geographicScope: {
    classification: 'broad-bounding-box' | 'global';
    pointInPolygonApplied: false;
  };
  metadata: {
    returnedFeatureCount: number;
    normalizedEventCount: number;
    skippedMalformedCount: number;
    duplicateIdCount: number;
    earliestEventTime: string | null;
    latestEventTime: string | null;
    eventBeforeRequestStartCount: number;
    eventAfterRequestEndCount: number;
    invalidCoordinateCount: number;
    invalidTimestampCount: number;
    resultLimitReached: boolean;
  };
  sample: {
    firstEventId: string | null;
    firstEventTime: string | null;
    lastEventId: string | null;
    lastEventTime: string | null;
  };
  networkRequestsExecuted: 1;
  databaseWritesExecuted: 0;
  warnings: string[];
};

