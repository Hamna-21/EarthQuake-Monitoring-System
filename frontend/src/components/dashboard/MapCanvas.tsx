import { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Earthquake } from '../../types';
import MapAuxiliaryLayers from './MapAuxiliaryLayers';
import MapEventLayers from './MapEventLayers';
import { MapTileKey, mapTiles } from './mapStyles';
import { FitBounds, FlyToSelected, FlyToTarget } from './mapRuntime';

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
}

export default function MapCanvas(props: MapCanvasProps) {
  const selectedEvent = useMemo(
    () => props.events.find((event) => event.id === props.selectedId),
    [props.events, props.selectedId]
  );
  const tileConfig = mapTiles[props.tile ?? 'dark'];

  return (
    <div className="h-[420px] sm:h-[500px] lg:h-[640px]">
      <div className="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl [&_.leaflet-container]:!overflow-visible [&_.leaflet-pane]:!overflow-visible [&_.leaflet-popup-pane]:!z-[1000]">
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer attribution={tileConfig.attribution} url={tileConfig.url} />
          <FitBounds events={props.events.slice(0, 80)} />
          <FlyToSelected event={selectedEvent} />
          <FlyToTarget target={props.flyTarget} />
          <MapAuxiliaryLayers
            plates={Boolean(props.plates)}
            userPosition={props.userPosition}
            searchPin={props.searchPin}
          />
          <MapEventLayers
            events={props.events}
            heat={Boolean(props.heat)}
            onSelect={props.onSelect}
            onDetails={props.onDetails}
          />
        </MapContainer>
      </div>
    </div>
  );
}


