import type { AnalyticsBackfillPlanInterval } from '../../types/analyticsBackfillPlan';
import { AnalyticsBackfillPlanError } from './analyticsBackfillPlanner';

export type AnalyticsUsgsIntervalRequest = {
  intervalKey: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  requestStartDate: Date;
  requestEndDate: Date;
  boundaryConvention: 'start-inclusive-end-exclusive';
  usgsEndAdjustmentMilliseconds: 1;
};

const copy = (date: Date) => new Date(date.getTime());
const valid = (date: Date) => date instanceof Date && Number.isFinite(date.getTime());
const fail = (message: string): never => { throw new AnalyticsBackfillPlanError(message); };

export function createUsgsRequestForPlannedInterval(
  interval: AnalyticsBackfillPlanInterval,
): AnalyticsUsgsIntervalRequest {
  const plannedStartDate = copy(interval.startDate);
  const plannedEndDate = copy(interval.endDate);
  if (!interval.intervalKey.trim()) fail('Interval key is required.');
  if (!valid(plannedStartDate) || !valid(plannedEndDate)) fail('Interval dates must be valid.');
  if (plannedStartDate.getTime() >= plannedEndDate.getTime()) fail('Planned interval must be non-zero and start before end.');
  const requestStartDate = copy(plannedStartDate);
  const requestEndDate = new Date(plannedEndDate.getTime() - 1);
  if (requestStartDate.getTime() > requestEndDate.getTime()) fail('USGS request range is invalid after end adjustment.');
  return {
    intervalKey: interval.intervalKey,
    plannedStartDate,
    plannedEndDate,
    requestStartDate,
    requestEndDate,
    boundaryConvention: 'start-inclusive-end-exclusive',
    usgsEndAdjustmentMilliseconds: 1,
  };
}

