import type { Earthquake } from '@/types';

export type AnalyticsFilters = {
  region: 'pakistan' | 'global';
  startDate: string;
  endDate: string;
  minMagnitude: number;
  location: string;
  maxMagnitude: number | null;
  minDepth: number | null;
  maxDepth: number | null;
};

export type YearlyFrequencyPoint = {
  year: number;
  count: number;
};

export type MonthlyFrequencyPoint = {
  key: string;
  label: string;
  year: number;
  month: number;
  count: number;
};

export type CalendarMonthFrequencyPoint = {
  month: number;
  shortLabel: string;
  fullLabel: string;
  count: number;
};

export type HistogramBin = {
  key: string;
  label: string;
  count: number;
};

export type HeatmapCell = {
  year: number;
  month: number;
  monthLabel: string;
  count: number;
};

export type MagnitudeGroupKey =
  | '4.0-4.9'
  | '5.0-5.9'
  | '6.0-6.9'
  | '7.0+';

export type AnalyticsSummary = {
  totalEvents: number;
  strongestMagnitude: number | null;
  averageMagnitude: number | null;
  averageDepth: number | null;
  shallowEventCount: number;
  mostActiveYear: YearlyFrequencyPoint | null;
  mostActiveMonth: CalendarMonthFrequencyPoint | null;
};

export type DepthDistribution = {
  bins: HistogramBin[];
  validDepthCount: number;
  missingDepthCount: number;
  shallowEventCount: number;
};

export type MagnitudeDistribution = {
  bins: HistogramBin[];
  validMagnitudeCount: number;
  missingMagnitudeCount: number;
};

export type MagnitudeGroups = Record<MagnitudeGroupKey, Earthquake[]>;

export function createDefaultAnalyticsFilters(region: AnalyticsFilters['region'] = 'global'): AnalyticsFilters {
  const now = new Date();
  const year = now.getUTCFullYear();
  return {
    region,
    startDate: `${year}-01-01`,
    endDate: now.toISOString().slice(0, 10),
    minMagnitude: 4,
    location: '',
    maxMagnitude: null,
    minDepth: null,
    maxDepth: null,
  };
}
