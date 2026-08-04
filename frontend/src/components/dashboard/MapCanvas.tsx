import { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Earthquake } from '../../types';
import MapAuxiliaryLayers from './MapAuxiliaryLayers';
import MapEventLayers from './MapEventLayers';
import { MapTileKey, mapTiles, markerColor } from './mapStyles';
import { FitBounds, FlyToSelected, FlyToTarget, ResizeMapOnContainerChange } from './mapRuntime';

export interface FlyTarget {
  lat: number;
  lng: number;
  zoom?: number;
  nonce: number;
}

export interface UserPosition {
  lat: number;
  lng: number;
  accuracy: number;
}

export interface SearchPin {
  lat: number;
  lng: number;
  label: string;
}

interface MapCanvasProps {
  events: Earthquake[];
  selectedId?: string | null;
  onSelect: (event: Earthquake) => void;
  tile?: MapTileKey;
  heat?: boolean;
  plates?: boolean;
  onDetails?: (event: Earthquake) => void;
  flyTarget?: FlyTarget | null;
  userPosition?: UserPosition | null;
  searchPin?: SearchPin | null;
  popupMode?: 'compact' | 'historical';
}

export default function MapCanvas(props: MapCanvasProps) {
  const selectedEvent = useMemo(
    () => props.events.find((event) => event.id === props.selectedId),
    [props.events, props.selectedId]
  );
  const mappableEvents = useMemo(
    () => props.events.filter((event) => Number.isFinite(event.latitude) && Number.isFinite(event.longitude)),
    [props.events]
  );
  const strongestIds = useMemo(() => {
    const mags = mappableEvents.map((event) => event.magnitude).filter(Number.isFinite);
    const highest = mags.length ? Math.max(...mags) : null;
    return new Set(mappableEvents.filter((event) => event.magnitude === highest).map((event) => event.id));
  }, [mappableEvents]);
  const tileConfig = mapTiles[props.tile ?? 'dark'];

  return (
    <div className="h-[420px] sm:h-[500px] lg:h-[640px]">
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl [&_.leaflet-container]:!overflow-visible [&_.leaflet-pane]:!overflow-visible [&_.leaflet-popup-pane]:!z-[1000]">
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer attribution={tileConfig.attribution} url={tileConfig.url} />
          <ResizeMapOnContainerChange />
          <FitBounds events={mappableEvents.slice(0, 80)} />
          <FlyToSelected event={selectedEvent} />
          <FlyToTarget target={props.flyTarget} />
          <MapAuxiliaryLayers plates={Boolean(props.plates)} userPosition={props.userPosition} searchPin={props.searchPin} />
          <MapEventLayers
            events={mappableEvents}
            strongestIds={strongestIds}
            heat={Boolean(props.heat)}
            onSelect={props.onSelect}
            onDetails={props.onDetails}
            popupMode={props.popupMode}
          />
        </MapContainer>
        <MapLegend />
      </div>
    </div>
  );
}

function MapLegend() {
  const items = [['Low', 3], ['Moderate', 5], ['Strong', 6], ['Major', 7]] as const;
  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-[900] rounded-2xl border border-white/10 bg-slate-950/85 p-3 font-serif text-white shadow-2xl backdrop-blur-xl">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">Map legend</p>
      <div className="space-y-1.5">
        {items.map(([label, mag]) => <LegendItem key={label} color={markerColor(mag)} label={`${label} · M${mag}+`} />)}
        <LegendItem color="#ef4444" label="Strongest in current view" strong />
      </div>
    </div>
  );
}

function LegendItem({ color, label, strong = false }: { color: string; label: string; strong?: boolean }) {
  return <div className={`flex items-center gap-2 text-xs font-bold ${strong ? 'text-red-100' : 'text-slate-200'}`}><span className={`${strong ? 'h-3.5 w-3.5 border-2 border-white shadow-[0_0_12px_#ef4444]' : 'h-3 w-3'} rounded-full`} style={{ background: color }} />{label}</div>;
}
