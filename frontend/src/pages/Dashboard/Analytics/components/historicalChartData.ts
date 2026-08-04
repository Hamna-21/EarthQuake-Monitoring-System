import type { HistoricalRow } from '../historicalAnalyticsApi';

export const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const fmt = (value: number) => value.toLocaleString();
export const safeCount = (row?: HistoricalRow) => Number(row?.count ?? 0);

export function readMonth(row: HistoricalRow, index: number) {
  if (typeof row.month === 'number') return row.month === 0 ? 1 : row.month;
  const text = String(row.label ?? '').toLowerCase();
  const hit = monthShort.findIndex((month) => text.startsWith(month.toLowerCase()));
  return hit >= 0 ? hit + 1 : index + 1;
}

export function calendarRows(rows: HistoricalRow[]) {
  const byMonth = new Map(rows.map((row, index) => [readMonth(row, index), safeCount(row)]));
  return monthShort.map((label, index) => ({
    month: index + 1,
    label,
    fullLabel: monthFull[index],
    count: byMonth.get(index + 1) ?? 0,
  }));
}

export function orderedRows(rows: HistoricalRow[], labels: string[]) {
  const clean = (value: string) => value.replaceAll('–', '-').replaceAll('—', '-').replaceAll(' km', '').toLowerCase();
  return labels.map((label, index) => {
    const found = rows.find((row) => clean(String(row.label ?? '')) === clean(label));
    return { label, count: safeCount(found ?? rows[index]) };
  });
}

export function tickYears(rows: HistoricalRow[], desired: number) {
  const years = rows.map((row) => Number(row.year)).filter(Number.isFinite);
  if (!years.length) return [];
  const first = years[0], last = years.at(-1)!;
  const step = Math.max(1, Math.ceil((last - first) / Math.max(1, desired - 1)));
  return [...new Set([first, ...years.filter((year) => (year - first) % step === 0), last])];
}

export function monthlyLabels(rows: HistoricalRow[], desired = 10) {
  const step = Math.max(1, Math.ceil(rows.length / desired));
  return rows.filter((_, index) => index === 0 || index === rows.length - 1 || index % step === 0)
    .map((row) => row.label ?? `${monthShort[(row.month ?? 1) - 1]} ${row.year}`);
}

export function peakRow<T extends { count: number }>(rows: T[]) {
  return rows.reduce<T | null>((best, row) => !best || row.count > best.count ? row : best, null);
}
