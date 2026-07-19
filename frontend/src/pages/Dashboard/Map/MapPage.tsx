import { useMemo, useState } from 'react';
import { Compass } from 'lucide-react';
import { Earthquake } from '../../../types';
import MapCanvas from '../../../components/dashboard/MapCanvas';
import { MapTileKey } from '../../../components/dashboard/mapStyles';
import { DashboardProps } from '../../../components/dashboard/types';
import { RefreshNote } from '../../../components/dashboard/Shell';
import MapControlPanel from './components/MapControlPanel';
import MapLegend from './components/MapLegend';
import MapStatsPanel from './components/MapStatsPanel';
import SelectedMapEvent from './components/SelectedMapEvent';

export default function MapPage({ earthquakes, selectedEvent, setSelectedId, openPage, isLoading, dataError }: DashboardProps) {
  const [minMag, setMinMag] = useState(0);
  const [query, setQuery] = useState('');
  const [tile, setTile] = useState<MapTileKey>('dark');
  const [heat, setHeat] = useState(false);
  const [plates, setPlates] = useState(false);
  const q = query.toLowerCase().trim();
  const events = useMemo(() => earthquakes.filter((event) => {
    const text = `${event.place} ${event.magnitude} ${event.depth}`.toLowerCase();
    return event.magnitude >= minMag && (!q || text.includes(q));
  }), [earthquakes, minMag, q]);
  const select = (event: Earthquake) => setSelectedId(event.id);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-950 p-5 text-white shadow-2xl md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-200">Global Earthquake Intelligence Map</p>
          <h1 className="mt-2 text-4xl font-black">Real-time seismic operations view</h1>
        </div>
        <div className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">Live Connection</div>
      </div>
      <RefreshNote isLoading={isLoading} error={dataError} />
      <div className="relative">
        <MapCanvas
          events={events}
          selectedId={selectedEvent?.id}
          onSelect={select}
          onDetails={(event) => { setSelectedId(event.id); openPage('details'); }}
          tile={tile}
          heat={heat}
          plates={plates}
          immersive
        />
        <div className="pointer-events-none absolute inset-4 grid gap-4 lg:grid-cols-[300px_1fr_310px]">
          <div className="pointer-events-auto space-y-4">
            <MapControlPanel query={query} minMag={minMag} tile={tile} heat={heat} plates={plates} onQuery={setQuery} onMinMag={setMinMag} onTile={setTile} onHeat={setHeat} onPlates={setPlates} />
            <MapLegend />
          </div>
          <div className="flex items-end justify-center">
            <div className="pointer-events-auto rounded-full border border-white/10 bg-slate-950/80 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-white backdrop-blur">
              Scale 500 km | Ripple markers | {events.length} events
            </div>
          </div>
          <div className="pointer-events-auto space-y-4">
            <div className="ml-auto grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-slate-950/85 text-cyan-100 shadow-2xl backdrop-blur">
              <Compass className="h-7 w-7" />
            </div>
            <MapStatsPanel events={events} />
            <SelectedMapEvent event={selectedEvent} onDetails={() => openPage('details')} />
          </div>
        </div>
      </div>
    </section>
  );
}
