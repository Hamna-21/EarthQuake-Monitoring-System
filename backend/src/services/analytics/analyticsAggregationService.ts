import type { Db, Document, Filter } from 'mongodb';
import type { AnalyticsEarthquakeDocument } from '../../types/analyticsEarthquakeDocument';
import type { ValidatedAnalyticsQuery } from './analyticsQuery';
import { ANALYTICS_EARTHQUAKE_COLLECTION } from '../../repositories/analyticsEarthquakeRepository';

export type AnalyticsDashboardOptions = ValidatedAnalyticsQuery & { mapLimit?: number };

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const magBins = ['Below 4.0', '4.0-4.9', '5.0-5.9', '6.0-6.9', '7.0-7.9', '8.0+'];
const depthBins = ['0-10', '>10-30', '>30-70', '>70-150', '>150-300', '>300'];
const yearRange = (start: Date, end: Date) => Array.from({ length: end.getUTCFullYear() - start.getUTCFullYear() + 1 }, (_, index) => start.getUTCFullYear() + index);
const magLabel = (mag: number | null) => mag === null ? null : mag < 4 ? magBins[0] : mag < 5 ? magBins[1] : mag < 6 ? magBins[2] : mag < 7 ? magBins[3] : mag < 8 ? magBins[4] : magBins[5];
const depthLabel = (depth: number | null) => depth === null ? null : depth <= 10 ? depthBins[0] : depth <= 30 ? depthBins[1] : depth <= 70 ? depthBins[2] : depth <= 150 ? depthBins[3] : depth <= 300 ? depthBins[4] : depthBins[5];

function match(options: AnalyticsDashboardOptions): Filter<AnalyticsEarthquakeDocument> {
  const filter: Filter<AnalyticsEarthquakeDocument> = { occurredAt: { $gte: options.startDate, $lte: options.endDate } };
  if (options.minMagnitude !== null) filter.magnitude = { ...(filter.magnitude as Document), $gte: options.minMagnitude };
  if (options.maxMagnitude !== null) filter.magnitude = { ...(filter.magnitude as Document), $lte: options.maxMagnitude };
  if (options.minDepth !== null) filter.depth = { ...(filter.depth as Document), $gte: options.minDepth };
  if (options.maxDepth !== null) filter.depth = { ...(filter.depth as Document), $lte: options.maxDepth };
  return filter;
}

function fillYears(rows: Document[], years: number[]) {
  const map = new Map(rows.map((row) => [Number(row._id), Number(row.count)]));
  return years.map((year) => ({ year, count: map.get(year) ?? 0 }));
}

function fillCalendar(rows: Document[]) {
  const map = new Map(rows.map((row) => [Number(row._id), Number(row.count)]));
  return months.map((month, index) => ({ month, count: map.get(index + 1) ?? 0 }));
}

function fillBins(rows: Document[], labels: string[]) {
  const map = new Map(rows.map((row) => [String(row._id), Number(row.count)]));
  return labels.map((label) => ({ label, count: map.get(label) ?? 0 }));
}

function heatmap(rows: Document[], years: number[]) {
  const map = new Map(rows.map((row) => [`${row._id.year}-${row._id.month}`, Number(row.count)]));
  return years.flatMap((year) => months.map((month, index) => ({ year, month: index + 1, label: month, count: map.get(`${year}-${index + 1}`) ?? 0 })));
}

// Use one MongoDB facet to calculate summary cards, chart series, and map events from the same filter.
export async function getAnalyticsDashboard(db: Db, options: AnalyticsDashboardOptions) {
  const collection = db.collection<AnalyticsEarthquakeDocument>(ANALYTICS_EARTHQUAKE_COLLECTION);
  const filter = match(options), years = yearRange(options.startDate, options.endDate);
  const [facet] = await collection.aggregate([{
    $match: filter,
  }, {
    $facet: {
      summary: [{ $group: { _id: null, totalEvents: { $sum: 1 }, strongestMagnitude: { $max: '$magnitude' }, averageMagnitude: { $avg: '$magnitude' }, averageDepth: { $avg: '$depth' }, shallowEventCount: { $sum: { $cond: [{ $and: [{ $ne: ['$depth', null] }, { $lte: ['$depth', 70] }] }, 1, 0] } } } }],
      yearly: [{ $group: { _id: { $year: '$occurredAt' }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }],
      monthly: [{ $group: { _id: { year: { $year: '$occurredAt' }, month: { $month: '$occurredAt' } }, count: { $sum: 1 } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }],
      calendar: [{ $group: { _id: { $month: '$occurredAt' }, count: { $sum: 1 } } }],
      magnitudes: [{ $match: { magnitude: { $ne: null } } }, { $addFields: { bin: { $switch: { branches: magBins.slice(0, 5).map((_, i) => ({ case: i === 0 ? { $lt: ['$magnitude', 4] } : { $and: [{ $gte: ['$magnitude', i + 3] }, { $lt: ['$magnitude', i + 4] }] }, then: magBins[i] })), default: magBins[5] } } } }, { $group: { _id: '$bin', count: { $sum: 1 } } }],
      depths: [{ $match: { depth: { $ne: null } } }, { $addFields: { bin: { $switch: { branches: [{ case: { $lte: ['$depth', 10] }, then: depthBins[0] }, { case: { $lte: ['$depth', 30] }, then: depthBins[1] }, { case: { $lte: ['$depth', 70] }, then: depthBins[2] }, { case: { $lte: ['$depth', 150] }, then: depthBins[3] }, { case: { $lte: ['$depth', 300] }, then: depthBins[4] }], default: depthBins[5] } } } }, { $group: { _id: '$bin', count: { $sum: 1 } } }],
      mapEvents: [{ $sort: { occurredAt: -1 } }, { $limit: options.mapLimit ?? 500 }, { $project: { _id: 0, usgsId: 1, magnitude: 1, place: 1, occurredAt: 1, depth: 1, coordinates: '$location.coordinates' } }],
    },
  }]).toArray();
  const yearlyFrequency = fillYears(facet?.yearly ?? [], years);
  const monthlyTimeline = heatmap(facet?.monthly ?? [], years);
  const mostActiveYear = [...yearlyFrequency].sort((a, b) => b.count - a.count || a.year - b.year)[0] ?? null;
  const mostActiveMonth = [...monthlyTimeline].sort((a, b) => b.count - a.count || a.year - b.year || a.month - b.month)[0] ?? null;
  const summary = Object.fromEntries(Object.entries(facet?.summary?.[0] ?? {}).filter(([key]) => key !== '_id'));
  return {
    summary: { totalEvents: 0, strongestMagnitude: null, averageMagnitude: null, averageDepth: null, shallowEventCount: 0, ...summary, mostActiveYear, mostActiveMonth },
    yearlyFrequency, monthlyTimeline, calendarMonthFrequency: fillCalendar(facet?.calendar ?? []),
    magnitudeDistribution: fillBins(facet?.magnitudes ?? [], magBins), depthDistribution: fillBins(facet?.depths ?? [], depthBins),
    yearMonthHeatmap: monthlyTimeline, magnitudeGroups: fillBins(facet?.magnitudes ?? [], magBins), mapEvents: facet?.mapEvents ?? [],
    metadata: { dataMode: 'historical' as const, source: 'MongoDB' as const, geographicClassification: 'broad-bounding-box' as const, pointInPolygonApplied: false, generatedAt: new Date().toISOString(), documentCount: facet?.summary?.[0]?.totalEvents ?? 0 },
  };
}
