import type { Request, Response } from 'express';
import { getAnalyticsDashboardFallback } from '../services/analytics/analyticsDashboardFallback';
import { resolveAnalyticsLocation } from '../services/analytics/analyticsLocationResolver';
import { AnalyticsValidationError, validateAnalyticsQuery } from '../services/analytics/analyticsQuery';
import { UsgsAnalyticsError } from '../services/analytics/usgsAnalyticsClient';

class QueryError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

const sendError = (res: Response, status: number, code: string, message: string) =>
  res.status(status).json({ success: false, error: { code, message } });

function readSingle(value: unknown, field: string) {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) throw new QueryError(400, 'REPEATED_QUERY_VALUE', `${field} accepts only one value.`);
  if (typeof value === 'object') throw new QueryError(400, 'INVALID_QUERY_VALUE', `${field} must be a single value.`);
  return String(value);
}

function readDashboardQuery(req: Request) {
  return validateAnalyticsQuery({
    region: readSingle(req.query.region, 'region') ?? 'global',
    startDate: readSingle(req.query.startDate, 'startDate') ?? '1975-01-01',
    endDate: readSingle(req.query.endDate, 'endDate') ?? new Date().toISOString(),
    minMagnitude: readSingle(req.query.minMagnitude, 'minMagnitude') ?? '4',
    maxMagnitude: readSingle(req.query.maxMagnitude, 'maxMagnitude'),
    minDepth: readSingle(req.query.minDepth, 'minDepth'),
    maxDepth: readSingle(req.query.maxDepth, 'maxDepth'),
    location: readSingle(req.query.location, 'location') ?? '',
  });
}

export async function analyticsDashboardHandler(req: Request, res: Response) {
  try {
    const query = await resolveAnalyticsLocation(readDashboardQuery(req));
    return res.json({ success: true, ...(await getAnalyticsDashboardFallback(query)) });
  } catch (error) {
    if (error instanceof QueryError) return sendError(res, error.status, error.code, error.message);
    if (error instanceof AnalyticsValidationError) return sendError(res, 400, error.code.toUpperCase(), error.message);
    if (error instanceof UsgsAnalyticsError) return sendError(res, 503, 'USGS_FALLBACK_FAILED', 'Historical analytics fallback could not fetch USGS data.');
    console.error('Analytics dashboard error:', error instanceof Error ? error.message : error);
    return sendError(res, 500, 'ANALYTICS_DASHBOARD_FAILED', 'Historical analytics dashboard could not be generated.');
  }
}
