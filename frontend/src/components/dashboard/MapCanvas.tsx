import { DivIcon, LatLngBounds } from 'leaflet';
import { useEffect, useMemo } from 'react';
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { Earthquake } from '../../types';
import MapPopup from './MapPopup';
import { MapTileKey, mapTiles, markerColor } from './mapStyles';
import { plateLines } from './plateBoundaries';

function FitBounds({ events }: { events: Earthquake[] }) {
  const map = useMap();
  useEffect(() => {
    if (!events.length) return;
    const bounds = new LatLngBounds(events.map((e) => [e.latitude, e.longitude] as [number, number]));
    map.fitBounds(bounds, { animate: true, duration: 0.8, padding: [50, 50] });
  }, [events, map]);
  return null;
}

function FlyToSelected({ event }: { event?: Earthquake | null }) {
  const map = useMap();
  useEffect(() => {
    if (event) map.flyTo([event.latitude, event.longitude], Math.max(map.getZoom(), 6), { duration: 1.1 });
  }, [event, map]);
  return null;
}

function rippleIcon(event: Earthquake) {
  const color = markerColor(event.magnitude);
  const size = Math.max(24, event.magnitude * 9);
  return new DivIcon({
    className: '',
    html: `<span class="relative block" style="width:${size}px;height:${size}px">
      <span class="absolute inset-0 rounded-full animate-ping" style="background:${color};opacity:.32"></span>
      <span class="absolute rounded-full border-2" style="inset:22%;border-color:${color};box-shadow:0 0 18px ${color};background:${color}cc"></span>
    </span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function MapCanvas({
  events,
  selectedId,
  onSelect,
  tile = 'dark',
  immersive = false,
  heat = false,
  plates = false,
  onDetails,
}: {
  events: Earthquake[];
  selectedId?: string | null;
  onSelect: (event: Earthquake) => void;
  tile?: MapTileKey;
  immersive?: boolean;
  heat?: boolean;
  plates?: boolean;
  onDetails?: (event: Earthquake) => void;
}) {
  const selectedEvent = useMemo(() => events.find((event) => event.id === selectedId), [events, selectedId]);
  const tileConfig = mapTiles[tile];

  return (
    <div className={`${immersive ? 'h-[calc(100vh-170px)] min-h-[680px]' : 'h-[600px]'} overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl`}>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer attribution={tileConfig.attribution} url={tileConfig.url} />
        <FitBounds events={events.slice(0, 80)} />
        <FlyToSelected event={selectedEvent} />
        {plates && plateLines.map((line) => (
          <Polyline key={line.name} positions={line.points} pathOptions={{ color: '#fb923c', opacity: 0.72, weight: 2 }} />
        ))}
        {events.slice(0, 500).map((event) => heat ? (
          <CircleMarker
            key={event.id}
            center={[event.latitude, event.longitude]}
            radius={Math.max(8, event.magnitude * 5)}
            pathOptions={{ color: markerColor(event.magnitude), fillColor: markerColor(event.magnitude), fillOpacity: 0.22, weight: 1 }}
            eventHandlers={{ click: () => onSelect(event) }}
          />
        ) : (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={rippleIcon(event)}
            eventHandlers={{ click: () => onSelect(event) }}
          >
            <Popup className="geopulse-popup">
              <MapPopup event={event} onSelect={onSelect} onDetails={onDetails} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
