import { mapUsgsFeature, type EarthquakeRecord } from './earthquakeService';
import { insidePakistan } from './pakistanBoundary';
const USGS_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const MIN_DATE = '1975-01-01';
const CACHE_MS = 30 * 60 * 1000;
const cache = new Map<string, { expires: number; data: HistoricalResponse }>();
export type HistoricalResponse = {
  success: boolean;
  source: 'USGS';
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
  count: number;
  hasMore: boolean;
  nextPage: number | null;
  earthquakes: EarthquakeRecord[];
};
const today = () => new Date().toISOString().slice(0, 10);
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
const asNumber = (value: unknown, fallback: number) => Number.isFinite(Number(value)) ? Number(value) : fallback;
function readDates(query: Record<string, any>) {
  const startDate = String(query.startDate ?? MIN_DATE);
  const endDate = String(query.endDate ?? today());
  if (!validDate(startDate) || !validDate(endDate)) throw new Error('Invalid date. Use YYYY-MM-DD format.');
  if (startDate < MIN_DATE) throw new Error('Start date cannot be earlier than 1975-01-01.');
  if (endDate > today()) throw new Error('End date cannot be in the future.');
  if (startDate > endDate) throw new Error('Start date cannot be later than end date.');
  return { startDate, endDate };
}
function buildParams(query: Record<string, any>, page: number) {
  const { startDate, endDate } = readDates(query);
  const limit = Math.min(Math.max(asNumber(query.limit, 50), 1), 200);
  const offset = (page - 1) * limit + 1;
  const params = new URLSearchParams({ format: 'geojson', starttime: startDate, endtime: endDate, limit: String(limit), offset: String(offset), orderby: String(query.sort ?? 'time') });
  const minMag = asNumber(query.minMagnitude ?? query.minmagnitude, 4);
  if (minMag < 0 || minMag > 10) throw new Error('Minimum magnitude must be between 0 and 10.');
  params.set('minmagnitude', String(minMag));
  if (query.maxMagnitude) params.set('maxmagnitude', String(query.maxMagnitude));
  if (query.minDepth) params.set('mindepth', String(query.minDepth));
  if (query.maxDepth) params.set('maxdepth', String(query.maxDepth));
  if (String(query.mode ?? query.region ?? 'global') === 'pakistan') {
    params.set('minlatitude', '23.5'); params.set('maxlatitude', '37.5');
    params.set('minlongitude', '60'); params.set('maxlongitude', '78.5');
  }
  return { params, startDate, endDate, page, limit };
}
const dedupe = (records: EarthquakeRecord[]) => [...new Map(records.map((event) => [event.id, event])).values()];
function localFilter(records: EarthquakeRecord[], query: Record<string, any>) {
  const mode = String(query.mode ?? query.region ?? 'global');
  const rawText = String(query.query ?? query.regionText ?? '').trim().toLowerCase();
  const text = mode === 'pakistan' && rawText === 'pakistan' ? '' : rawText;
  const outsidePakistan = /afghanistan|tajikistan|india|iran|china|kyrgyzstan|jurm|bazarak/i;
  return records
    .filter((event) => mode !== 'pakistan' || insidePakistan(event))
    .filter((event) => mode !== 'pakistan' || !outsidePakistan.test(event.place))
    .filter((event) => !text || `${event.place} ${event.id} ${event.status} ${event.alert ?? ''}`.toLowerCase().includes(text));
}
async function fetchPage(query: Record<string, any>, page: number) {
  const built = buildParams(query, page);
  const response = await fetch(`${USGS_URL}?${built.params.toString()}`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`USGS historical request failed with status ${response.status}`);
  const data = await response.json();
  const features = Array.isArray(data.features) ? data.features : [];
  return { built, features, records: localFilter(dedupe(features.map(mapUsgsFeature)), query) };
}
export async function fetchHistoricalEarthquakes(query: Record<string, any>): Promise<HistoricalResponse> {
  const page = Math.max(asNumber(query.page, 1), 1);
  const limit = Math.min(Math.max(asNumber(query.limit, 50), 1), 200);
  const cacheKey = JSON.stringify({ mapper: 2, ...query, page, limit });
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.data;
  const scan = String(query.mode ?? query.region ?? 'global') === 'pakistan' || Boolean(String(query.query ?? query.regionText ?? '').trim());
  const batch = await fetchPage(query, scan ? 1 : page);
  let collected = batch.records;
  let sourcePage = 2;
  let sourceCount = batch.features.length;
  while (scan && collected.length < page * limit + 1 && sourcePage <= Math.max(10, page + 12) && sourceCount === limit) {
    const next = await fetchPage(query, sourcePage++);
    sourceCount = next.features.length;
    collected = dedupe([...collected, ...next.records]);
  }
  const earthquakes = scan ? collected.slice((page - 1) * limit, page * limit) : collected;
  const hasMore = scan ? collected.length > page * limit : batch.features.length === limit;
  const result = {
    success: true as const,
    source: 'USGS' as const,
    startDate: batch.built.startDate,
    endDate: batch.built.endDate,
    page,
    limit,
    count: earthquakes.length,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
    earthquakes,
  };
  cache.set(cacheKey, { expires: Date.now() + CACHE_MS, data: result });
  return result;
}
