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

export function buildUsgsAnalyticsCountParams(request: UsgsAnalyticsCountRequest) {
  const params = buildUsgsAnalyticsParams({ ...request, limit: 1 });
  params.delete('format');
  params.delete('orderby');
  params.delete('limit');
  params.delete('offset');
  return params;
}

function readCount(text: string, status?: number) {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) throw new UsgsAnalyticsError('USGS count response was not a non-negative integer.', status);
  const count = Number(trimmed);
  if (!Number.isSafeInteger(count) || count < 0) throw new UsgsAnalyticsError('USGS count response was outside the safe integer range.', status);
  return count;
}

export async function fetchUsgsAnalyticsCount(
  request: UsgsAnalyticsCountRequest,
  options: UsgsAnalyticsCountOptions = {},
): Promise<UsgsAnalyticsCountResult> {
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
