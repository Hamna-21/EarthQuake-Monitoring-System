import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { Earthquake } from '@/types';
import MapPopup from '@/features/dashboard/map/components/MapPopup';
import { fmtDate } from '@/features/dashboard/utils/data';
import { quakeFlatIcon, quakePinIcon, repositionPopup, tierClass } from '@/features/dashboard/map/components/mapRuntime';

interface MapEventLayersProps {
  events: Earthquake[];
  strongestIds: Set<string>;
  heat: boolean;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
  popupMode?: 'compact' | 'historical';
  markerMode?: 'pin' | 'flat';
}

function MapEventLayers({ events, strongestIds, heat, onSelect, onDetails, popupMode, markerMode = 'pin' }: MapEventLayersProps) {
  // Render every map event from the normalized dataset so marker clicks and popup records cannot diverge.
  return (
    <>
      {events.map((event) => {
        const isStrongest = strongestIds.has(event.id);
        return (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={markerMode === 'flat' ? quakeFlatIcon(event, isStrongest) : quakePinIcon(event, isStrongest, popupMode === 'historical' || heat)}
            eventHandlers={{ click: () => onSelect(event) }}
          >
            <Tooltip className="geopulse-marker-tooltip" direction="top" offset={[0, -26]} opacity={1}>
              <MarkerTooltip event={event} />
            </Tooltip>
            <EventPopup event={event} isStrongest={isStrongest} onSelect={onSelect} onDetails={onDetails} popupMode={popupMode} />
          </Marker>
        );
      })}
    </>
  );
}

export default React.memo(MapEventLayers);

interface EventPopupProps {
  event: Earthquake;
  isStrongest: boolean;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
  popupMode?: 'compact' | 'historical';
}

function EventPopup({ event, isStrongest, onSelect, onDetails, popupMode }: EventPopupProps) {
  return (
    <Popup
      className={`geopulse-popup quake-popup ${isStrongest ? 'tier-strongest' : tierClass(event.magnitude)}`}
      minWidth={190}
      maxWidth={popupMode === 'historical' ? 250 : 210}
      autoPan
      autoPanPaddingTopLeft={[20, 40]}
      autoPanPaddingBottomRight={[20, 20]}
      closeButton={false}
      eventHandlers={{ add: repositionPopup }}
    >
      <MapPopup event={event} isStrongest={isStrongest} onSelect={onSelect} onDetails={onDetails} mode={popupMode} />
    </Popup>
  );
}

function MarkerTooltip({ event }: { event: Earthquake }) {
  const depth = Number.isFinite(event.depth) ? `${event.depth.toFixed(1)} km` : 'Unknown';
  return <div className="min-w-[190px] font-serif text-xs text-slate-200">
    <p className="text-base font-black text-orange-100">M{event.magnitude.toFixed(1)}</p>
    <p className="mt-0.5 max-w-[220px] font-bold text-white">{event.place}</p>
    <p className="mt-1 text-[11px] font-semibold text-slate-300">{fmtDate(event.time, 'UTC')}</p>
    <p className="text-[11px] font-semibold text-slate-300">Depth {depth} · Tsunami {event.tsunami ? 'Yes' : 'No'}</p>
    <p className="text-[11px] font-semibold text-cyan-100">{event.latitude.toFixed(2)}, {event.longitude.toFixed(2)}</p>
  </div>;
}
