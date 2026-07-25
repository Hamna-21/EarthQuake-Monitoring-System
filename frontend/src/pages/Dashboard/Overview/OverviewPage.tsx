import { DashboardProps } from '../../../components/dashboard/types';
import { significant } from '../../../components/dashboard/data';
import { RefreshNote } from '../../../components/dashboard/Shell';
import { useAuthSession } from '../../../hooks/useAuthSession'; // adjust path to where the hook actually lives
import ActiveRegions from './components/ActiveRegions';
import ActivitySummary from './components/ActivitySummary';
import MagnitudeDistribution from './components/MagnitudeDistribution';
import OverviewHero from './components/OverviewHero';
import OverviewStatGrid from './components/OverviewStatGrid';


export default function OverviewPage({ earthquakes, isLoading, dataError, setSelectedId, openPage }: DashboardProps) {
  const { userName } = useAuthSession();
  const major = significant(earthquakes).slice(0, 8);
  const select = (id: string) => {
    setSelectedId(id);
    openPage('details');
  };

  return (
    <section className="space-y-6">
      <OverviewHero />
      
      <RefreshNote isLoading={isLoading} error={dataError} />
      <OverviewStatGrid earthquakes={earthquakes} />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ActivitySummary earthquakes={earthquakes} />
        <MagnitudeDistribution earthquakes={earthquakes} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ActiveRegions earthquakes={earthquakes} />
      </div>
    </section>
  );
}