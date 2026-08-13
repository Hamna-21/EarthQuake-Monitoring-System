import { Compass, Radio } from 'lucide-react';
import { Earthquake } from '@/types';
import { DashboardProps } from '@/features/dashboard/types';
import { RefreshNote } from '@/layouts/DashboardLayout';
import GlobalCommandCenter from '@/features/dashboard/map/components/GlobalCommandCenter';

export default function MapPage({ earthquakes, setSelectedId, openPage, isLoading, dataError, lastUpdated, globalSearch = '' }: DashboardProps) {
  const select = (event: Earthquake) => setSelectedId(event.id);
  const openDetails = (event: Earthquake) => {
    setSelectedId(event.id);
    openPage('details');
  };

  return (
    <section className="space-y-4">
      <div className="relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 px-5 py-3 shadow-2xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative min-w-0">
          <p className="flex items-center gap-2 font-serif text-[10px] font-black uppercase tracking-[0.28em] text-orange-200">
            <Compass className="h-3.5 w-3.5" /> Global Earthquake Intelligence
          </p>
          <h1 className="mt-1.5 truncate bg-gradient-to-r from-orange-200 via-white to-red-200 bg-clip-text font-serif text-2xl font-black tracking-tight text-transparent sm:text-3xl">
            Interactive global earthquake map
          </h1>
        </div>
        <div className="relative flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-black text-emerald-200">
          <Radio className="h-3.5 w-3.5 animate-pulse" /> Live Connection
        </div>
      </div>

      <RefreshNote isLoading={isLoading} error={dataError} lastUpdated={lastUpdated} />
      <div className="rounded-2xl border border-white/10 bg-slate-950 p-1.5 sm:p-2">
        <GlobalCommandCenter events={earthquakes} onSelect={select} onDetails={openDetails} lastUpdated={lastUpdated} />
      </div>
    </section>
  );
}
