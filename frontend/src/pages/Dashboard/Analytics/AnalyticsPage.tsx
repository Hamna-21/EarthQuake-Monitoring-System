import React from 'react';
import { DashboardProps } from '../../../components/dashboard/types';
import { statsFor, significant } from '../../../components/dashboard/data';
import { CountryChart, DepthChart, MagnitudeChart, TimelineChart } from '../../../components/dashboard/Charts';
import { MetricCard } from '../../../components/dashboard/ui';
import { PageTitle, RefreshNote } from '../../../components/dashboard/Shell';

export default function AnalyticsPage({ earthquakes, isLoading, dataError }: DashboardProps) {
  const stats = statsFor(earthquakes);
  const major = significant(earthquakes).filter((e) => e.magnitude >= 5).length;
  return (
    <>
      <PageTitle eyebrow="Analytics & Insights" title="Convert seismic data into decisions" subtitle="Charts and comparisons are generated from live  records currently loaded in GeoPulse." />
      <RefreshNote isLoading={isLoading} error={dataError} />
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Average Magnitude" value={stats.avgMag.toFixed(2)} help="Mean value across current events" />
        <MetricCard label="Significant Events" value={major} help="Magnitude 5+ or alert-worthy records" />
        <MetricCard label="Reviewed Events" value={stats.reviewed} help="Status equals reviewed" />
        <MetricCard label="Max Depth" value={`${stats.maxDepth.toFixed(0)} km`} help="Deepest returned event" />
        <MetricCard label="Red Alerts" value={stats.red} help="Critical alert level records" />
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <MagnitudeChart events={earthquakes} />
        <DepthChart events={earthquakes} />
        <CountryChart events={earthquakes} />
        <TimelineChart events={earthquakes} />
      </section>
    </>
  );
}
