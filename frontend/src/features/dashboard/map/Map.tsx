import { Compass, Radio } from 'lucide-react';
import { Earthquake } from '@/types';
import { DashboardProps } from '@/features/dashboard/types';
import { RefreshNote } from '@/layouts/DashboardLayout';
import GlobalCommandCenter from '@/features/dashboard/map/components/GlobalCommandCenter';
import PageTitle from '@/features/dashboard/components/common/PageTitle';

/** Presents the live global map and connects marker selection to the dashboard details route. */
export default function MapPage({ earthquakes, setSelectedId, openPage, isLoading, dataError, lastUpdated, globalSearch = '' }: DashboardProps) {
  const select = (event: Earthquake) => setSelectedId(event.id);
  const openDetails = (event: Earthquake) => {
    setSelectedId(event.id);
    openPage('details');
  };

  return (
    <section className="space-y-4">
      <PageTitle eyebrow="Global Earthquake Intelligence" title="Interactive global earthquake map" icon={Compass} actions={<div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-black text-emerald-200">
          <Radio className="h-3.5 w-3.5 animate-pulse" /> Live Connection
        </div>} />

      <RefreshNote isLoading={isLoading} error={dataError} lastUpdated={lastUpdated} />
      <div className="rounded-2xl border border-white/10 bg-slate-950 p-1.5 sm:p-2">
        <GlobalCommandCenter events={earthquakes} onSelect={select} onDetails={openDetails} globalSearch={globalSearch} lastUpdated={lastUpdated} />
      </div>
    </section>
  );
}
