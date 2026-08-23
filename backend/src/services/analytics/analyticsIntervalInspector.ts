import type { AnalyticsBackfillPlanInterval } from '../../types/analyticsBackfillPlan';
import type { AnalyticsIntervalInspection } from '../../types/analyticsIntervalInspection';
import type { AnalyticsRegion } from './analyticsQuery';
import { createUsgsRequestForPlannedInterval } from './analyticsIntervalRequest';
import { fetchAnalyticsInterval, UsgsAnalyticsError } from './usgsAnalyticsClient';

export type AnalyticsIntervalInspectionInput = {
  interval: AnalyticsBackfillPlanInterval;
  region: AnalyticsRegion;
  minMagnitude: number;
  maxMagnitude: number | null;
  minDepth: number | null;
  maxDepth: number | null;
};

export class AnalyticsIntervalInspectionError extends Error {
  constructor(message: string, public code = 'INTERVAL_INSPECTION_FAILED') {
    super(message);
    this.name = 'AnalyticsIntervalInspectionError';
  }
}

const validTime = (value: string) => Number.isFinite(Date.parse(value));
const validCoord = (longitude: number, latitude: number) =>
  Number.isFinite(longitude) && longitude >= -180 && longitude <= 180 && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;

const warnings = (region: AnalyticsRegion) => [
  'This was a read-only inspection; no earthquake records were stored.',
  region === 'pakistan'
    ? 'Pakistan results use a broad geographic bounding box and are not final country classifications.'
    : 'Global results are not country-classified during this inspection.',
  'A successful small inspection does not prove that every yearly interval will remain below USGS result limits.',
  'No automatic retries or interval splitting were performed.',
];

/** Coordinates inspect analytics interval for this module. */
export async function inspectAnalyticsInterval(
  input: AnalyticsIntervalInspectionInput,
  options: { signal?: AbortSignal } = {},
): Promise<AnalyticsIntervalInspection> {
  // Inspect one interval read-only and report malformed events, date leakage, duplicates, and upstream limits.
  const request = createUsgsRequestForPlannedInterval(input.interval);
  try {
    const response = await fetchAnalyticsInterval({
      startDate: request.requestStartDate, endDate: request.requestEndDate, region: input.region,
      minMagnitude: input.minMagnitude, maxMagnitude: input.maxMagnitude,
      minDepth: input.minDepth, maxDepth: input.maxDepth,
    }, { signal: options.signal, timeoutMs: 20000 });
    const times = response.events.map((event) => event.time).filter(validTime).sort();
    const first = response.events[0] ?? null;
    const last = response.events.at(-1) ?? null;
    const before = response.events.filter((event) => Date.parse(event.time) < request.requestStartDate.getTime()).length;
    const after = response.events.filter((event) => Date.parse(event.time) > request.requestEndDate.getTime()).length;
    const badCoords = response.events.filter((event) => !validCoord(event.longitude, event.latitude)).length;
    const badTimes = response.events.filter((event) => !validTime(event.time)).length;
    return {
      mode: 'read-only-inspection', intervalKey: input.interval.intervalKey,
      request: {
        region: input.region, plannedStartDate: request.plannedStartDate.toISOString(),
        plannedEndDate: request.plannedEndDate.toISOString(), requestStartDate: request.requestStartDate.toISOString(),
        requestEndDate: request.requestEndDate.toISOString(), minMagnitude: input.minMagnitude,
        maxMagnitude: input.maxMagnitude, minDepth: input.minDepth, maxDepth: input.maxDepth,
      },
      geographicScope: { classification: input.region === 'pakistan' ? 'broad-bounding-box' : 'global', pointInPolygonApplied: false },
      metadata: {
        returnedFeatureCount: response.returnedFeatureCount, normalizedEventCount: response.events.length,
        skippedMalformedCount: response.skippedFeatureCount, duplicateIdCount: response.duplicateIds.length,
        earliestEventTime: times[0] ?? null, latestEventTime: times.at(-1) ?? null,
        eventBeforeRequestStartCount: before, eventAfterRequestEndCount: after,
        invalidCoordinateCount: badCoords, invalidTimestampCount: badTimes, resultLimitReached: false,
      },
      sample: { firstEventId: first?.id ?? null, firstEventTime: first?.time ?? null, lastEventId: last?.id ?? null, lastEventTime: last?.time ?? null },
      networkRequestsExecuted: 1, databaseWritesExecuted: 0, warnings: warnings(input.region),
    };
  } catch (error) {
    if (error instanceof UsgsAnalyticsError && error.message.toLowerCase().includes('truncated')) {
      throw new AnalyticsIntervalInspectionError('USGS result limit reached; inspect a smaller interval before backfill.', 'RESULT_LIMIT_REACHED');
    }
    throw error;
  }
}

