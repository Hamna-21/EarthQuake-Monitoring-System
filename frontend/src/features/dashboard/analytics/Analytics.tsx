import {
  Activity,
  AlertTriangle,
  ChevronRight,
  Gauge,
  Layers,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useMemo } from 'react';

import type { Earthquake } from '@/types';
import type {
  DashboardPage,
  DashboardProps,
} from '@/features/dashboard/types';

import {
  countryOf,
  fmtDate,
  significant,
  statsFor,
} from '@/features/dashboard/utils/data';

import {
  DepthChart,
  TimelineChart,
} from '@/features/dashboard/components/Charts';

import AnalyticsStatCard from '@/features/dashboard/analytics/components/AnalyticsStatCard';
import PageTitle from '@/features/dashboard/components/common/PageTitle';

type LiveAnalyticsProps = Pick<
  DashboardProps,
  'earthquakes' | 'globalSearch'
> & {
  variant?: 'full' | 'overview';
  openPage?: (page: DashboardPage) => void;
};

const liveAnalyticsSummary = (events: Earthquake[]) => {
  if (events.length === 0) return 'No live earthquakes in the current dataset.';
  const stats = statsFor(events);
  const stronger = significant(events).filter((event) => event.magnitude >= 5).length;
  const parts = [
    `${events.length} event${events.length === 1 ? '' : 's'}`,
    `avg M${stats.avgMag.toFixed(1)}`,
    stronger > 0 ? `${stronger} at M5+` : null,
    `deepest ${stats.maxDepth.toFixed(0)} km`,
    stats.red > 0 ? `${stats.red} red alert${stats.red === 1 ? '' : 's'}` : null,
    stats.tsunami > 0 ? `${stats.tsunami} tsunami warning${stats.tsunami === 1 ? '' : 's'}` : null,
  ].filter(Boolean);
  return parts.join(' - ');
};

/** Renders or coordinates live analytics page for this frontend module. */
export default function LiveAnalyticsPage(props: DashboardProps) {
  return <LiveAnalyticsContent {...props} variant="full" />;
}

/** Renders or coordinates live analytics content for this frontend module. */
export function LiveAnalyticsContent({
  earthquakes,
  globalSearch = '',
  variant = 'full',
  openPage,
}: LiveAnalyticsProps) {
  const q = globalSearch.trim().toLowerCase();
  const events = useMemo(() => q
    ? earthquakes.filter((event) =>
        `${event.place} ${countryOf(event.place)} ${event.id} ${event.magnitude} ${event.alert ?? ''} ${event.status} ${fmtDate(event.time, 'UTC')}`.toLowerCase().includes(q)
      )
    : earthquakes, [earthquakes, q]);
  const stats = useMemo(() => statsFor(events), [events]);
  const stronger = useMemo(() => significant(events).filter((event) => event.magnitude >= 5).length, [events]);
  const cards = useMemo(() => [
    [<Gauge className="h-5 w-5" />, 'Average Strength', stats.avgMag.toFixed(2), 'Typical magnitude', 'from-cyan-400 via-sky-500 to-blue-600', 'shadow-cyan-900/30'],
    [<AlertTriangle className="h-5 w-5" />, 'Stronger Earthquakes', String(stronger), 'Magnitude 5.0+', 'from-amber-400 via-orange-500 to-rose-500', 'shadow-orange-900/30'],
    [<ShieldCheck className="h-5 w-5" />, 'Checked Reports', String(stats.reviewed), 'Reviewed records', 'from-emerald-400 via-teal-500 to-cyan-500', 'shadow-emerald-900/30'],
    [<Layers className="h-5 w-5" />, 'Deepest Earthquake', `${stats.maxDepth.toFixed(0)} km`, 'Maximum depth', 'from-violet-400 via-purple-500 to-fuchsia-600', 'shadow-purple-900/30'],
    [<Activity className="h-5 w-5" />, 'Highest Alerts', String(stats.red), 'Red alert records', 'from-rose-500 via-red-500 to-rose-700', 'shadow-rose-900/30'],
  ] as const, [stats.avgMag, stronger, stats.reviewed, stats.maxDepth, stats.red]);

  if (variant === 'overview') {
    return (
      <section className="analytics-overview">
        <div className="analytics-overview__header">
          <div>
            <h2 className="analytics-overview__title">Live Seismic Analytics</h2>
            <p className="analytics-overview__summary">{liveAnalyticsSummary(events)}</p>
          </div>
          {openPage ? (
            <button type="button" onClick={() => openPage('analytics')} className="analytics-link">
              View charts <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <div className="analytics-page">
      <PageTitle title="Live Seismic Analytics" subtitle="Live earthquake patterns and seismic activity" actions={openPage ? (
          <button type="button" onClick={() => openPage('overview')} aria-label="Close analytics" title="Close analytics" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/60 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300">
            <X className="h-4 w-4" />
          </button>
        ) : null} />
      <div className="analytics-grid">
        {cards.map(([icon, label, value, help, gradient, glow]) => <AnalyticsStatCard key={label} icon={icon} label={label} value={value} help={help} gradient={gradient} glow={glow} />)}
      </div>
      <section className="analytics-section">
        <div className="analytics-section__heading">
          <h2 className="analytics-section__title">Recent Earthquake Activity</h2>
          <p className="analytics-section__subtitle">Hover over chart points to view earthquake counts</p>
        </div>
        <TimelineChart events={events} />
      </section>
      <section className="analytics-section">
        <div className="analytics-section__heading">
          <h2 className="analytics-section__title">Earthquake Depth</h2>
          <p className="analytics-section__subtitle">Distribution by depth below the surface</p>
        </div>
        <DepthChart events={events} />
      </section>
    </div>
  );
}
/** Hosts the dashboard analytics page and coordinates its data sections. */
