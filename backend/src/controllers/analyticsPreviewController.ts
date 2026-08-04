import type { Request, Response } from 'express';
import { AnalyticsValidationError, validateAnalyticsQuery } from '../services/analytics/analyticsQuery';
import { fetchAnalyticsInterval, UsgsAnalyticsError } from '../services/analytics/usgsAnalyticsClient';

const MAX_PREVIEW_DAYS = 31;
const PREVIEW_RESULT_LIMIT = 1000;
const fields = ['region', 'startDate', 'endDate', 'minMagnitude', 'maxMagnitude', 'minDepth', 'maxDepth'] as const;

class PreviewError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

const sendError = (res: Response, status: number, code: string, message: string) =>
  res.status(status).json({ success: false, error: { code, message } });

function readSingle(value: unknown, field: string) {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) throw new PreviewError(400, 'REPEATED_QUERY_VALUE', `${field} accepts only one value.`);
  if (typeof value === 'object') throw new PreviewError(400, 'INVALID_QUERY_VALUE', `${field} must be a single value.`);
  return String(value);
}

const utcDayStart = (date: Date) => Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

function readPreviewQuery(query: Request['query']) {
  const cleaned: Record<string, string> = {};
  for (const field of fields) {
    const value = readSingle(query[field], field);
    if (value !== undefined && value !== '') cleaned[field] = value;
  }
  if (!cleaned.startDate?.trim() || !cleaned.endDate?.trim()) throw new PreviewError(400, 'PREVIEW_DATE_RANGE_REQUIRED', 'The preview route requires startDate and endDate.');
  const validated = validateAnalyticsQuery(cleaned);
  const days = Math.floor((utcDayStart(validated.endDate) - utcDayStart(validated.startDate)) / 86_400_000) + 1;
  if (days > MAX_PREVIEW_DAYS) throw new PreviewError(400, 'PREVIEW_RANGE_TOO_LARGE', 'Analytics preview requests are limited to 31 days.');
  return validated;
}

function geographicScope(region: 'pakistan' | 'global') {
  const pakistan = region === 'pakistan';
  return {
    requestedRegion: region, classification: pakistan ? 'broad-bounding-box' as const : 'global' as const,
    pointInPolygonApplied: false as const,
    note: pakistan ? 'Pakistan preview results use a broad geographic bounding box.' : 'Global preview results are not country-classified.',
  };
}

function handleError(error: unknown, res: Response) {
  if (error instanceof PreviewError) return sendError(res, error.status, error.code, error.message);
  if (error instanceof AnalyticsValidationError) return sendError(res, 400, error.code.toUpperCase(), error.message);
  if (error instanceof UsgsAnalyticsError) return sendError(res, 502, 'USGS_UPSTREAM_ERROR', 'Earthquake data could not be retrieved from USGS.');
  console.error('Analytics preview unexpected error:', error instanceof Error ? error.message : error);
  return sendError(res, 500, 'ANALYTICS_PREVIEW_FAILED', 'Analytics preview could not be generated.');
}

export async function analyticsPreviewHandler(req: Request, res: Response) {
  try {
    const query = readPreviewQuery(req.query);
    const preview = await fetchAnalyticsInterval({ ...query, limit: PREVIEW_RESULT_LIMIT }, { timeoutMs: 15000 });
    return res.json({
      success: true, source: 'USGS', generatedAt: new Date().toISOString(),
      request: { region: query.region, startDate: query.startDateUtc, endDate: query.endDateUtc, minMagnitude: query.minMagnitude, maxMagnitude: query.maxMagnitude, minDepth: query.minDepth, maxDepth: query.maxDepth },
      geographicScope: geographicScope(query.region),
      metadata: { usgsGeneratedAt: preview.metadata.generated ? new Date(preview.metadata.generated).toISOString() : null, returnedFeatureCount: preview.returnedFeatureCount, normalizedEventCount: preview.events.length, skippedMalformedCount: preview.skippedFeatureCount, duplicateIdCount: preview.duplicateIds.length },
      events: preview.events,
    });
  } catch (error) {
    return handleError(error, res);
  }
}
