import type { Request, Response } from 'express';
import { getAnalyticsDashboardFallback } from '../services/analytics/analyticsDashboardFallback';
import { AnalyticsLocationError, resolveAnalyticsLocation } from '../services/analytics/analyticsLocationResolver';
import { AnalyticsValidationError, validateAnalyticsQuery } from '../services/analytics/analyticsQuery';
import { UsgsAnalyticsError } from '../services/analytics/usgsAnalyticsClient';
import { AnalyticsRequestBudgetError } from '../services/analytics/analyticsCompleteFetch';

class QueryError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

const sendError = (res: Response, status: number, code: string, message: string) =>
  res.status(status).json({ success: false, error: { code, message } });

/** Checks whether upstream timeout for the surrounding workflow. */
function isUpstreamTimeout(error: unknown) {
  if (error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError')) return true;
  return error instanceof Error && /timeout|timed out|etimedout/i.test(error.message);
}

/** Parses and normalizes single for the module's data flow. */
function readSingle(value: unknown, field: string) {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) throw new QueryError(400, 'REPEATED_QUERY_VALUE', `${field} accepts only one value.`);
  if (typeof value === 'object') throw new QueryError(400, 'INVALID_QUERY_VALUE', `${field} must be a single value.`);
  return String(value);
}

const DEFAULT_RANGE_DAYS = 30;
const MAX_EXPLICIT_RANGE_DAYS = 10 * 366;

/** Coordinates date only for this module. */
function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

/** Parses and normalizes dashboard query for the module's data flow. */
function readDashboardQuery(req: Request) {
  const now = new Date();
  const hasStartDate = req.query.startDate !== undefined;
  const hasEndDate = req.query.endDate !== undefined;
  const defaultStart = new Date(now.getTime() - DEFAULT_RANGE_DAYS * 24 * 60 * 60 * 1000);
  const query = validateAnalyticsQuery({
    region: readSingle(req.query.region, 'region') ?? 'global',
    startDate: readSingle(req.query.startDate, 'startDate') ?? (!hasEndDate ? dateOnly(defaultStart) : '1975-01-01'),
    endDate: readSingle(req.query.endDate, 'endDate') ?? dateOnly(now),
    minMagnitude: readSingle(req.query.minMagnitude, 'minMagnitude') ?? '4',
    maxMagnitude: readSingle(req.query.maxMagnitude, 'maxMagnitude'),
    minDepth: readSingle(req.query.minDepth, 'minDepth'),
    maxDepth: readSingle(req.query.maxDepth, 'maxDepth'),
    location: readSingle(req.query.location, 'location') ?? '',
  });
  if (hasStartDate && hasEndDate && (query.endDate.getTime() - query.startDate.getTime()) > MAX_EXPLICIT_RANGE_DAYS * 24 * 60 * 60 * 1000) {
    throw new AnalyticsRequestBudgetError();
  }
  return query;
}

// Normalize dashboard query parameters, resolve locations, and map known failures to stable API errors.
export async function analyticsDashboardHandler(req: Request, res: Response) {
  try {
    const query = await resolveAnalyticsLocation(readDashboardQuery(req));
    return res.json({ success: true, ...(await getAnalyticsDashboardFallback(query)) });
  } catch (error) {
    if (error instanceof QueryError) return sendError(res, error.status, error.code, error.message);
    if (error instanceof AnalyticsValidationError) return sendError(res, 400, error.code.toUpperCase(), error.message);
    if (error instanceof AnalyticsRequestBudgetError) return sendError(res, 400, 'ANALYTICS_QUERY_TOO_BROAD', error.message);
    if (error instanceof AnalyticsLocationError) return sendError(res, 400, 'LOCATION_RESOLUTION_FAILED', error.message);
    if (isUpstreamTimeout(error)) return sendError(res, 504, 'ANALYTICS_UPSTREAM_TIMEOUT', 'Historical data is taking longer than expected. Please try again.');
    if (error instanceof UsgsAnalyticsError) return sendError(res, 503, 'USGS_FALLBACK_FAILED', 'Historical earthquake data is temporarily unavailable. Please try again.');
    if (error instanceof TypeError && /fetch failed|network/i.test(error.message)) return sendError(res, 503, 'ANALYTICS_UPSTREAM_UNAVAILABLE', 'Historical analytics data is temporarily unavailable. Please try again.');
    console.error('Analytics dashboard error:', error instanceof Error ? error.message : error);
    return sendError(res, 500, 'ANALYTICS_DASHBOARD_FAILED', 'Historical analytics dashboard could not be generated.');
  }
}
