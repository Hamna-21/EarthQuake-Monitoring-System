import { CircleMarker, Marker, Popup } from 'react-leaflet';
import { Earthquake } from '@/types';
import MapPopup from '@/features/dashboard/map/components/MapPopup';
import { markerColor } from '@/features/dashboard/map/components/mapStyles';
import { repositionPopup, rippleIcon, tierClass } from '@/features/dashboard/map/components/mapRuntime';

interface MapEventLayersProps {
  events: Earthquake[];
  strongestIds: Set<string>;
  heat: boolean;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
  popupMode?: 'compact' | 'historical';
}

export default function MapEventLayers({ events, strongestIds, heat, onSelect, onDetails, popupMode }: MapEventLayersProps) {
  return (
    <>
      {events.map((event) => {
        const isStrongest = strongestIds.has(event.id);
        const radius = popupMode === 'historical' ? (isStrongest ? 10 : 4) : (isStrongest ? Math.max(16, event.magnitude * 6) : Math.max(8, event.magnitude * 5));
        return heat ? (
          <CircleMarker
            key={event.id}
            center={[event.latitude, event.longitude]}
            radius={radius}
            pathOptions={{
              color: isStrongest ? '#ffffff' : markerColor(event.magnitude),
              fillColor: isStrongest ? '#ef4444' : markerColor(event.magnitude),
              fillOpacity: isStrongest ? 0.42 : 0.22,
              weight: isStrongest ? 3 : 1,
            }}
            eventHandlers={{ click: () => onSelect(event) }}
          >
            <EventPopup event={event} isStrongest={isStrongest} onSelect={onSelect} onDetails={onDetails} popupMode={popupMode} />
          </CircleMarker>
        ) : (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={rippleIcon(event, isStrongest)}
            eventHandlers={{ click: () => onSelect(event) }}
          >
            <EventPopup event={event} isStrongest={isStrongest} onSelect={onSelect} onDetails={onDetails} popupMode={popupMode} />
          </Marker>
        );
      })}
    </>
  );
}

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
