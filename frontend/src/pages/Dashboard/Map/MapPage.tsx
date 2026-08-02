import { useRef } from 'react';
import { Compass, Radio } from 'lucide-react';
import { Earthquake } from '../../../types';
import MapCanvas from '../../../components/dashboard/MapCanvas';
import { DashboardProps } from '../../../components/dashboard/types';
import { RefreshNote } from '../../../components/dashboard/Shell';
import MapControlPanel from './components/MapControlPanel';
import { useMapControls } from './useMapControls';

export default function MapPage({ earthquakes, selectedEvent, setSelectedId, openPage, isLoading, dataError, lastUpdated, globalSearch = '' }: DashboardProps) {
  const mapShellRef = useRef<HTMLDivElement | null>(null);
  const map = useMapControls(earthquakes, globalSearch, setSelectedId);
  const fullscreenMap = () => {
    const node = mapShellRef.current;
    if (!node || !document.fullscreenEnabled) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else node.requestFullscreen();
  };
  const select = (event: Earthquake) => setSelectedId(event.id);
  const openDetails = (event: Earthquake) => {
    setSelectedId(event.id);
    openPage('details');
  };

  return (
    <section className="space-y-4">
      <div className="relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950 px-6 py-4 shadow-2xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="relative min-w-0">
          <p className="flex items-center gap-2 font-serif text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
            <Compass className="h-3.5 w-3.5" /> Global Earthquake Intelligence
          </p>
          <h1 className="mt-1.5 truncate bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text font-serif text-2xl font-black tracking-tight text-transparent sm:text-3xl">
            The world, mapped in real time.
          </h1>
        </div>
        <div className="relative flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-black text-emerald-200">
          <Radio className="h-3.5 w-3.5 animate-pulse" /> Live Connection
        </div>
      </div>

      <RefreshNote isLoading={isLoading} error={dataError} lastUpdated={lastUpdated} />
      <MapControlPanel {...map.controlPanelProps} onFullscreenMap={fullscreenMap} />

      <div ref={mapShellRef} className="h-[65vh] min-h-[480px] overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950">
        <MapCanvas
          events={map.events}
          selectedId={selectedEvent?.id}
          onSelect={select}
          onDetails={openDetails}
          tile={map.tile}
          heat={map.heat}
          plates={map.plates}
          flyTarget={map.flyTarget}
          userPosition={map.userPosition}
          searchPin={map.searchPin}
        />
      </div>
    </section>
  );
}
