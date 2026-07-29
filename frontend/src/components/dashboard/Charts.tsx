import { Earthquake } from '../../types';
import AnalyticsChartFrame from './charts/AnalyticsChartFrame';
import { AreaChart, DonutChart, HorizontalBars, ScatterChart, VerticalBars } from './charts/SvgCharts';
import { depthRows, magnitudeRows, regionRows, scatterPoints, timelineRows } from './charts/analyticsChartData';

const top = <T extends { label: string; value: number }>(rows: T[]) =>
  rows.reduce((best, row) => (row.value > best.value ? row : best), rows[0] ?? { label: 'No data', value: 0 });

export function TimelineChart({ events }: { events: Earthquake[] }) {
  const rows = timelineRows(events);
  const latest = rows.at(-1);
  const peak = top(rows);
  return (
    <AnalyticsChartFrame
      title="Earthquakes Over Recent Days"
      subtitle="A simple line showing whether recent activity is going up, down, or staying steady."
      takeaway={latest ? `Latest day shown: ${latest.value} earthquake${latest.value === 1 ? '' : 's'}. Highest recent day: ${peak.label} with ${peak.value}.` : 'No recent earthquake dates are available yet.'}
      insight="This helps you quickly see if earthquake reports are clustering on certain days. A sudden high point means that day had more recorded activity than the surrounding days."
      info="Each point is the number of earthquake records loaded for that date."
      wide
    >
      <AreaChart rows={rows} />
    </AnalyticsChartFrame>
  );
}

export function MagnitudeChart({ events }: { events: Earthquake[] }) {
  const rows = magnitudeRows(events);
  const peak = top(rows);
  return (
    <AnalyticsChartFrame
      title="How Strong Were the Earthquakes?"
      subtitle="Earthquakes are grouped into everyday strength levels instead of technical ranges."
      takeaway={`Most loaded earthquakes are “${peak.label}” events (${peak.value} records).`}
      insight="Small and light earthquakes are common. Strong or major earthquakes matter more for safety, so they use warmer colors and are easier to spot."
      info="Magnitude tells how much energy an earthquake released. Bigger numbers mean stronger earthquakes."
    >
      <VerticalBars rows={rows} />
    </AnalyticsChartFrame>
  );
}

export function DepthChart({ events }: { events: Earthquake[] }) {
  const rows = depthRows(events);
  const peak = top(rows);
  return (
    <AnalyticsChartFrame
      title="How Deep Were the Earthquakes?"
      subtitle="A simple ring chart showing whether earthquakes were near the surface or deeper underground."
      takeaway={`Most events are ${peak.label.toLowerCase()} earthquakes (${peak.value} records).`}
      insight="Near-surface earthquakes can feel stronger at ground level than deeper earthquakes of the same magnitude, so this view is useful for safety awareness."
      info="Depth means how far below the Earth's surface the earthquake started."
    >
      <DonutChart rows={rows} />
    </AnalyticsChartFrame>
  );
}

export function CountryChart({ events }: { events: Earthquake[] }) {
  const rows = regionRows(events);
  const peak = top(rows);
  return (
    <AnalyticsChartFrame
      title="Where Are Earthquakes Happening Most?"
      subtitle="Regions are ranked from most activity to least activity in the loaded data."
      takeaway={peak.value ? `${peak.label} has the most earthquake records right now (${peak.value}).` : 'No region information is available in the loaded data.'}
      insight="This makes it easy to identify the places that need the most attention without reading every earthquake record one by one."
      info="Regions are estimated from the location text provided by the earthquake feed."
    >
      <HorizontalBars rows={rows} />
    </AnalyticsChartFrame>
  );
}

export function MagnitudeDepthChart({ events }: { events: Earthquake[] }) {
  const points = scatterPoints(events);
  const strongNearSurface = points.filter((p) => p.y >= 5 && p.x <= 70).length;
  return (
    <AnalyticsChartFrame
      title="Which Earthquakes Need More Attention?"
      subtitle="Each dot is one earthquake. Higher dots are stronger; left-side dots are closer to the surface."
      takeaway={`${strongNearSurface} loaded earthquake${strongNearSurface === 1 ? '' : 's'} are both stronger and near the surface.`}
      insight="The most important dots are usually high and left: those earthquakes combine stronger shaking with shallower depth, which can increase impact near the epicenter."
      info="Hover a dot to see its location, strength, and depth."
    >
      <ScatterChart points={points} />
    </AnalyticsChartFrame>
  );
}
