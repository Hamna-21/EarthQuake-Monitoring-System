import { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Earthquake } from '@/types';
import MapAuxiliaryLayers from '@/features/dashboard/map/components/MapAuxiliaryLayers';
import MapEventLayers from '@/features/dashboard/map/components/MapEventLayers';
import { MapTileKey, mapTiles, markerColor } from '@/features/dashboard/map/components/mapStyles';
import { FitBounds, FlyToSelected, FlyToTarget, ResizeMapOnContainerChange } from '@/features/dashboard/map/components/mapRuntime';

export interface FlyTarget { lat: number; lng: number; zoom?: number; nonce: number; }
export interface UserPosition { lat: number; lng: number; accuracy: number; }
export interface SearchPin { lat: number; lng: number; label: string; }

interface MapCanvasProps {
  events: Earthquake[]; selectedId?: string | null; onSelect: (event: Earthquake) => void;
  tile?: MapTileKey; heat?: boolean; plates?: boolean; onDetails?: (event: Earthquake) => void;
  flyTarget?: FlyTarget | null; userPosition?: UserPosition | null; searchPin?: SearchPin | null;
  popupMode?: 'compact' | 'historical'; focusTarget?: FlyTarget | null; focusBounds?: { south: number; north: number; west: number; east: number } | null; markerMode?: 'pin' | 'flat';
}

export default function MapCanvas(props: MapCanvasProps) {
  const selectedEvent = useMemo(() => props.events.find((event) => event.id === props.selectedId), [props.events, props.selectedId]);
  const mappableEvents = useMemo(() => props.events.filter((event) => Number.isFinite(event.latitude) && Number.isFinite(event.longitude)), [props.events]);
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
          <ResizeMapOnContainerChange /><FitBounds events={mappableEvents.slice(0, 80)} locationBounds={props.focusBounds} /><FlyToSelected event={selectedEvent} />
          <FlyToTarget target={props.flyTarget} /><FlyToTarget target={props.focusTarget} />
          <MapAuxiliaryLayers plates={Boolean(props.plates)} userPosition={props.userPosition} searchPin={props.searchPin} />
          <MapEventLayers events={mappableEvents} strongestIds={strongestIds} heat={Boolean(props.heat) || mappableEvents.length > 500} onSelect={props.onSelect} onDetails={props.onDetails} popupMode={props.popupMode} markerMode={props.markerMode} />
        </MapContainer>
        <MapLegend />
        <style>{markerCss}</style>
      </div>
    </div>
  );
}

function MapLegend() {
  const items = [['< M3', 2], ['M3-3.9', 3], ['M4-4.9', 4], ['M5-5.9', 5], ['M6-6.9', 6], ['M7+', 7]] as const;
  return <div className="pointer-events-none absolute bottom-3 left-3 z-[900] max-w-[calc(100%-1.5rem)] overflow-x-auto rounded-xl border border-white/10 bg-slate-950/85 p-2 font-serif text-white shadow-2xl backdrop-blur-xl">
    <div className="flex min-w-max items-center gap-2.5 whitespace-nowrap"><span className="text-[9px] font-black uppercase tracking-[0.14em] text-cyan-200">Legend</span>{items.map(([label, mag]) => <LegendItem key={label} color={markerColor(mag)} label={label} />)}<LegendItem color="#ef4444" label="Strongest" strong /></div>
  </div>;
}

function LegendItem({ color, label, strong = false }: { color: string; label: string; strong?: boolean }) {
  return <div className={`flex items-center gap-1 text-[10px] font-bold ${strong ? 'text-red-100' : 'text-slate-200'}`}><span className={`block h-2.5 w-2.5 rounded-full border ${strong ? 'border-white shadow-[0_0_8px_#ef4444]' : 'border-white/90'}`} style={{ background: color }} />{label}</div>;
}

const markerCss = `.quake-pin-wrap{position:relative;display:block;filter:drop-shadow(0 10px 14px rgba(0,0,0,.42));transition:transform .14s ease,filter .14s ease;transform-origin:50% 98%;cursor:pointer}.quake-pin-wrap:hover{transform:scale(1.14) translateY(-2px);filter:drop-shadow(0 12px 18px rgba(0,0,0,.55))}.quake-tack-svg{display:block;width:100%;height:100%}.quake-flat-marker{display:block;transition:transform .14s ease,filter .14s ease;cursor:pointer;transform-origin:50% 100%}.quake-flat-marker svg{display:block;width:100%;height:100%;filter:drop-shadow(0 2px 5px rgba(0,0,0,.55))}.quake-flat-marker:hover{transform:scale(1.18) translateY(-1px);filter:brightness(1.16)}.quake-pin-pulse{position:absolute;left:50%;top:2px;width:90%;height:42%;border-radius:999px;opacity:.32;transform:translateX(-50%);animation:quakePinPulse 1.9s ease-out infinite}@keyframes quakePinPulse{0%{transform:translateX(-50%) scale(.55);opacity:.38}100%{transform:translateX(-50%) scale(1.8);opacity:0}}.geopulse-marker-tooltip{background:rgba(2,6,23,.94)!important;border:1px solid rgba(125,211,252,.28)!important;border-radius:12px!important;color:#e2e8f0!important;box-shadow:0 18px 38px rgba(0,0,0,.32)!important;padding:8px 10px!important}.geopulse-marker-tooltip:before{border-top-color:rgba(2,6,23,.94)!important}`;
