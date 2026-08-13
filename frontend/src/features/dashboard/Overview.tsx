import { useMemo } from 'react';
import { DashboardProps } from '@/features/dashboard/types';
import { countryOf } from '@/features/dashboard/utils/data';
import { RefreshNote } from '@/layouts/DashboardLayout';
import ActiveRegions from '@/features/dashboard/components/ActiveRegions';
import ActivitySummary from '@/features/dashboard/components/ActivitySummary';
import MagnitudeDistribution from '@/features/dashboard/components/MagnitudeDistribution';
import OverviewHero from '@/features/dashboard/components/OverviewHero';
import OverviewStatGrid from '@/features/dashboard/components/OverviewStatGrid';
import OverviewQuickActions from '@/features/dashboard/components/OverviewQuickActions';
import GeoBotCard from '@/features/dashboard/components/GeoBotCard';

type Props = DashboardProps & {
  searchQuery?: string;
  userName?: string | null;
  userEmail?: string | null;
};

const matchesOverviewSearch = (event: DashboardProps['earthquakes'][number], query: string) => {
  const text = [
    event.place,
    countryOf(event.place),
    event.magnitude.toFixed(1),
    `magnitude ${event.magnitude.toFixed(1)}`,
    event.alert || 'no alert',
    event.status,
    event.tsunami ? 'tsunami warning' : 'no tsunami',
    event.id,
  ].join(' ').toLowerCase();

  return text.includes(query);
};

export default function OverviewPage({ earthquakes, isLoading, dataError, lastUpdated, openPage, searchQuery = '', userName, userEmail, selectedEvent }: Props) {
  const query = searchQuery.trim().toLowerCase();
  const visibleEarthquakes = useMemo(() => query ? earthquakes.filter((event) => matchesOverviewSearch(event, query)) : earthquakes, [earthquakes, query]);
  const hasNoMatches = query.length > 0 && visibleEarthquakes.length === 0;

  return (
    <section className="space-y-4">
      <OverviewHero />
      <RefreshNote isLoading={isLoading} error={dataError} lastUpdated={lastUpdated} userName={userName} />
      <OverviewQuickActions openPage={openPage} />
      {query && <p className="text-sm font-semibold text-slate-300">
        Showing {visibleEarthquakes.length} of {earthquakes.length} overview results for “{searchQuery.trim()}”.
      </p>}
      {hasNoMatches ? (
        <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-10 text-center shadow-sm backdrop-blur">
          <p className="font-serif text-2xl font-black text-white">No matching earthquakes found</p>
          <p className="mt-2 text-sm font-semibold text-slate-400">
            Try a country, location, magnitude, alert level, status, or event ID.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 xl:mb-4"><OverviewStatGrid earthquakes={visibleEarthquakes} /></div>
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <ActivitySummary earthquakes={visibleEarthquakes} />
            <MagnitudeDistribution earthquakes={visibleEarthquakes} />
          </div>
          <div className="mt-3 grid gap-4 pb-2 xl:mt-4 xl:grid-cols-[0.9fr_1.1fr]">
            <ActiveRegions earthquakes={visibleEarthquakes} />
          </div>
        </>
      )}
      <GeoBotCard earthquakes={visibleEarthquakes} selectedEvent={selectedEvent} userName={userName} userEmail={userEmail} />
    </section>
  );
}
