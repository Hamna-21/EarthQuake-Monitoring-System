import { DivIcon, LatLngBounds } from 'leaflet';
import { useEffect, useMemo } from 'react';
import { Circle, CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { Earthquake } from '../../types';
import MapPopup from './MapPopup';
import { MapTileKey, mapTiles, markerColor } from './mapStyles';
import { plateLines } from './plateBoundaries';

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

function FlyToTarget({ target }: { target?: FlyTarget | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lng], target.zoom ?? Math.max(map.getZoom(), 10), { duration: 1.2 });
  }, [target, map]);
  return null;
}

function userLocationIcon() {
  return new DivIcon({
    className: '',
    html: `<span class="relative block h-5 w-5">
      <span class="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping"></span>
      <span class="absolute inset-[5px] rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_10px_#22d3ee]"></span>
    </span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function searchPinIcon() {
  return new DivIcon({
    className: '',
    html: `<span class="relative block h-8 w-8 -translate-y-2">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 4px 6px rgba(0,0,0,.5))">
        <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z" fill="#e879f9"/>
        <circle cx="12" cy="10" r="3.2" fill="white"/>
      </svg>
    </span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
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

function tierClass(magnitude: number) {
  return magnitude >= 6 ? 'tier-high' : magnitude >= 5 ? 'tier-moderate' : 'tier-low';
}

function repositionPopup(e: { popup: L.Popup }) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      e.popup.update();
    });
  });
}

export default function MapCanvas({
  events,
  selectedId,
  onSelect,
  tile = 'dark',
  heat = false,
  plates = false,
  onDetails,
  flyTarget,
  userPosition,
  searchPin,
}: {
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
}) {
  const selectedEvent = useMemo(() => events.find((event) => event.id === selectedId), [events, selectedId]);
  const tileConfig = mapTiles[tile];

  return (
    <div className="h-[420px] sm:h-[500px] lg:h-[640px]">
      <div className="h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl [&_.leaflet-pane]:!overflow-visible [&_.leaflet-popup-pane]:!z-[1000] [&_.leaflet-container]:!overflow-visible">
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer attribution={tileConfig.attribution} url={tileConfig.url} />

          <FitBounds events={events.slice(0, 80)} />
          <FlyToSelected event={selectedEvent} />
          <FlyToTarget target={flyTarget} />

          {plates && plateLines.map((line) => (
            <Polyline
              key={line.name}
              positions={line.points}
              pathOptions={{ color: '#fb923c', opacity: 0.72, weight: 2 }}
            />
          ))}

          {userPosition && (
            <>
              <Marker position={[userPosition.lat, userPosition.lng]} icon={userLocationIcon()}>
                <Popup className="geopulse-popup" minWidth={160} maxWidth={200} autoPan closeButton>
                  You are here
                </Popup>
              </Marker>
              {userPosition.accuracy > 0 && (
                <Circle
                  center={[userPosition.lat, userPosition.lng]}
                  radius={userPosition.accuracy}
                  pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 0.08, weight: 1 }}
                />
              )}
            </>
          )}

          {searchPin && (
            <Marker position={[searchPin.lat, searchPin.lng]} icon={searchPinIcon()}>
              <Popup className="geopulse-popup" minWidth={220} maxWidth={280} autoPan closeButton>
                {searchPin.label}
              </Popup>
            </Marker>
          )}

          {events.slice(0, 500).map((event) =>
            heat ? (
              <CircleMarker
                key={event.id}
                center={[event.latitude, event.longitude]}
                radius={Math.max(8, event.magnitude * 5)}
                pathOptions={{
                  color: markerColor(event.magnitude),
                  fillColor: markerColor(event.magnitude),
                  fillOpacity: 0.22,
                  weight: 1,
                }}
                eventHandlers={{ click: () => onSelect(event) }}
              >
                <Popup
                  className={`geopulse-popup ${tierClass(event.magnitude)}`}
                  minWidth={420}
                  maxWidth={460}
                  autoPan
                  autoPanPaddingTopLeft={[20, 40]}
                  autoPanPaddingBottomRight={[20, 20]}
                  closeButton
                  eventHandlers={{ add: repositionPopup }}
                >
                  <MapPopup event={event} onSelect={onSelect} onDetails={onDetails} />
                </Popup>
              </CircleMarker>
            ) : (
              <Marker
                key={event.id}
                position={[event.latitude, event.longitude]}
                icon={rippleIcon(event)}
                eventHandlers={{ click: () => onSelect(event) }}
              >
               <Popup
  className={`geopulse-popup ${tierClass(event.magnitude)}`}
  minWidth={620}
  maxWidth={660}
  autoPan
  autoPanPaddingTopLeft={[20, 40]}
  autoPanPaddingBottomRight={[20, 20]}
  closeButton
  eventHandlers={{ add: repositionPopup }}
>
  <MapPopup event={event} onSelect={onSelect} onDetails={onDetails} />
</Popup>
              </Marker>
            )
          )}
        </MapContainer>
      </div>
    </div>
  );
}