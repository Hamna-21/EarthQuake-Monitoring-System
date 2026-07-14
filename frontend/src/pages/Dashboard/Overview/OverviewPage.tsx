import React from 'react';
import { DashboardProps } from '../../../components/dashboard/types';
import { significant, statsFor } from '../../../components/dashboard/data';
import { EventList, MetricCard } from '../../../components/dashboard/ui';
import { PageTitle, RefreshNote } from '../../../components/dashboard/Shell';
import OverviewHero from './components/OverviewHero';
import MagnitudeDistribution from './components/MagnitudeDistribution';

export default function OverviewPage({ earthquakes, isLoading, dataError, setSelectedId, openPage }: DashboardProps) {
  const stats = statsFor(earthquakes);
  const recent = significant(earthquakes).slice(0, 5);
  const latest = earthquakes.slice(0, 6);
  return (
    <>
      <OverviewHero />
      <RefreshNote isLoading={isLoading} error={dataError} />
      <section className="mt-8 grid gap-6 rounded-none md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label=" Earthquakes Today"
          value={stats.today}
          help="Recorded seismic events in the last 24 hours"
        />

        <MetricCard
          label=" Strongest Earthquake"
          value={`${stats.strongest.toFixed(1)}`}
          help="Highest magnitude detected worldwide"
        />

        <MetricCard
          label=" Countries Affected"
          value={stats.countries}
          help="Regions reporting seismic activity"
        />

        <MetricCard
          label="Tsunami Alerts"
          value={stats.tsunami}
          help="Earthquakes with tsunami warnings"
        />
      </section>
      <section className="mt-8 grid gap-8 xl:grid-cols-[1.3fr_430px]">
        {/* Recent Events */}
        <div className="border border-red-100 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-red-100 bg-gradient-to-r from-red-900 to-red-800 px-6 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-200">
                LIVE SEISMIC FEED
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Recent Significant Earthquakes
              </h2>
            </div>

            <button
              onClick={() => openPage("feed")}
              className=" px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-red-800"
            >
              View All 
            </button>
          </div>

          <div className="p-5">
            <EventList
              events={recent}
              onSelect={(e) => {
                setSelectedId(e.id);
                openPage("details");
              }}
            />
          </div>
        </div>

        {/* Magnitude Distribution */}
        <MagnitudeDistribution earthquakes={earthquakes} />
      </section>
      <section className="mt-6">
        <h3 className="mb-3 text-xl font-black text-slate-950">Latest Earthquake Feed</h3>
        <EventList events={latest} onSelect={(e) => { setSelectedId(e.id); openPage('details'); }} />
      </section>
    </>
  );
}
