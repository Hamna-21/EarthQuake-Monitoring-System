import { DashboardProps } from '../../../components/dashboard/types';
import { countryOf } from '../../../components/dashboard/data';
import { RefreshNote } from '../../../components/dashboard/Shell';
import ActiveRegions from './components/ActiveRegions';
import ActivitySummary from './components/ActivitySummary';
import MagnitudeDistribution from './components/MagnitudeDistribution';
import OverviewHero from './components/OverviewHero';
import OverviewStatGrid from './components/OverviewStatGrid';

type Props = DashboardProps & {
  searchQuery?: string;
  userName?: string | null;
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

export default function OverviewPage({ earthquakes, isLoading, dataError, lastUpdated, searchQuery = '', userName }: Props) {
  const query = searchQuery.trim().toLowerCase();
  const visibleEarthquakes = query
    ? earthquakes.filter((event) => matchesOverviewSearch(event, query))
    : earthquakes;
  const hasNoMatches = query.length > 0 && visibleEarthquakes.length === 0;

  return (
    <section className="space-y-6">
      <OverviewHero />
      <RefreshNote isLoading={isLoading} error={dataError} lastUpdated={lastUpdated} userName={userName} />
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
          <OverviewStatGrid earthquakes={visibleEarthquakes} />
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ActivitySummary earthquakes={visibleEarthquakes} />
            <MagnitudeDistribution earthquakes={visibleEarthquakes} />
          </div>
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <ActiveRegions earthquakes={visibleEarthquakes} />
          </div>
        </>
      )}
    </section>
  );
}
