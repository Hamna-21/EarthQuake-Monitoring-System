import { useMemo, useState } from 'react';
import type { Earthquake } from '@/types';
import MapCanvas from '@/features/dashboard/map/components/MapCanvas';
import { mapTiles, type MapTileKey } from '@/features/dashboard/map/components/mapStyles';

/** Displays the filtered historical events on the shared map/globe and forwards marker selection. */
export default function HistoryMapSection({
  title,
  description,
  events,
  loading,
  onSelect,
  onDetails,
  focusLocation,
}: {
  title: string;
  description: string;
  events: Earthquake[];
  loading: boolean;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
  focusLocation?: { lat: number; lng: number; label?: string; altitude?: number; bounds?: { south: number; north: number; west: number; east: number } } | null;
}) {
  const [tile, setTile] = useState<MapTileKey>('street');
  const viewOptions: MapTileKey[] = ['street', 'night', 'terrain'];
  const focusTarget = useMemo(() => focusLocation && !focusLocation.bounds ? { lat: focusLocation.lat, lng: focusLocation.lng, zoom: 6, nonce: 0 } : null, [focusLocation]);
  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl border border-cyan-400/15 bg-white/[0.05] shadow-2xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-violet-500/10 px-5 py-3">
        <div><h2 className="font-serif text-lg font-black text-white">{title}</h2><p className="text-sm font-medium text-slate-300">{description}</p></div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-300"><span>View</span><select value={tile} onChange={(event) => setTile(event.target.value as MapTileKey)} className="rounded-xl border border-cyan-300/20 bg-slate-950/80 px-3 py-2 text-xs font-bold text-white outline-none focus:border-cyan-300/50">{viewOptions.map((key) => <option key={key} value={key}>{mapTiles[key].label}</option>)}</select></label>
      </div>
      <MapCanvas events={events} tile={tile} onSelect={onSelect} onDetails={onDetails ?? onSelect} focusTarget={focusTarget} focusBounds={focusLocation?.bounds} popupMode="historical" markerMode="flat" />
      {(loading || !events.length) && (
        <div className="absolute right-4 top-20 z-[900] max-w-xs rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 text-sm text-slate-200 shadow-2xl backdrop-blur-xl">
          <p className="font-serif font-black text-white">{loading ? 'Loading map records...' : 'No map markers found'}</p>
          <p className="mt-1 text-xs text-slate-400">{loading ? 'Earthquake Monitoring System is fetching matching earthquakes.' : 'Try a wider date range, lower magnitude, or different location.'}</p>
        </div>
      )}
    </section>
  );
}
