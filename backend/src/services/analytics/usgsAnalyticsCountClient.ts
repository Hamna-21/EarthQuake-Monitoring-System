import type { AnalyticsRegion, ValidatedAnalyticsQuery } from './analyticsQuery';
import { buildUsgsAnalyticsParams, USGS_ANALYTICS_QUERY_URL, UsgsAnalyticsError } from './usgsAnalyticsClient';

export type UsgsAnalyticsCountRequest = Pick<
  ValidatedAnalyticsQuery,
  'startDate' | 'endDate' | 'region' | 'minMagnitude' | 'maxMagnitude' | 'minDepth' | 'maxDepth' | 'bounds'
>;

export type UsgsAnalyticsCountResult = {
  count: number;
  requestedAt: Date;
  requestStartDate: Date;
  requestEndDate: Date;
  source: 'USGS';
  geographicScope: 'broad-bounding-box' | 'global';
  requestUrl: string;
};

export type UsgsAnalyticsCountOptions = { timeoutMs?: number; signal?: AbortSignal };

const COUNT_URL = USGS_ANALYTICS_QUERY_URL.replace(/\/query$/, '/count');
const copy = (date: Date) => new Date(date.getTime());
const validDate = (date: Date) => date instanceof Date && Number.isFinite(date.getTime());

/** Builds the build usgs analytics count params result used by the surrounding workflow. */
export function buildUsgsAnalyticsCountParams(request: UsgsAnalyticsCountRequest) {
  // Reuse the event query builder but strip response-only parameters for the lightweight count endpoint.
  const params = buildUsgsAnalyticsParams({ ...request, limit: 1 });
  params.delete('format');
  params.delete('orderby');
  params.delete('limit');
  params.delete('offset');
  return params;
}

/** Parses and normalizes count for the module's data flow. */
function readCount(text: string, status?: number) {
  const trimmed = text.trim();
  let rawCount: unknown = trimmed;
  if (!/^\d+$/.test(trimmed)) {
    try {
      const parsed = JSON.parse(trimmed) as { count?: unknown };
      rawCount = parsed?.count;
    } catch {
      rawCount = undefined;
    }
  }
  const count = Number(rawCount);
  if (!Number.isInteger(count) || count < 0) throw new UsgsAnalyticsError('USGS count response was not a non-negative integer.', status);
  if (!Number.isSafeInteger(count) || count < 0) throw new UsgsAnalyticsError('USGS count response was outside the safe integer range.', status);
  return count;
}

/** Handles the fetch usgs analytics count operation and returns its normalized result. */
export async function fetchUsgsAnalyticsCount(
  request: UsgsAnalyticsCountRequest,
  options: UsgsAnalyticsCountOptions = {},
): Promise<UsgsAnalyticsCountResult> {
  // Count the constrained upstream query before deciding whether the date range must be split.
  if (!validDate(request.startDate) || !validDate(request.endDate)) throw new UsgsAnalyticsError('USGS count dates must be valid.');
  const requestStartDate = copy(request.startDate);
  const requestEndDate = copy(request.endDate);
  const requestUrl = `${COUNT_URL}?${buildUsgsAnalyticsCountParams(request).toString()}`;
  const signal = options.signal ?? AbortSignal.timeout(options.timeoutMs ?? 15000);
  const response = await fetch(requestUrl, { signal });
  if (!response.ok) throw new UsgsAnalyticsError(`USGS count request failed with status ${response.status}.`, response.status);
  return {
    count: readCount(await response.text(), response.status),
    requestedAt: new Date(),
    requestStartDate,
    requestEndDate,
    source: 'USGS',
    geographicScope: request.region === 'pakistan' ? 'broad-bounding-box' : 'global',
    requestUrl,
  };
}
