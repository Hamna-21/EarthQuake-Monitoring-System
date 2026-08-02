import { CircleMarker, Marker, Popup } from 'react-leaflet';
import { Earthquake } from '../../types';
import MapPopup from './MapPopup';
import { markerColor } from './mapStyles';
import { repositionPopup, rippleIcon, tierClass } from './mapRuntime';

interface MapEventLayersProps {
  events: Earthquake[];
  strongestIds: Set<string>;
  heat: boolean;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
}

export default function MapEventLayers({ events, strongestIds, heat, onSelect, onDetails }: MapEventLayersProps) {
  return (
    <>
      {events.slice(0, 500).map((event) => {
        const isStrongest = strongestIds.has(event.id);
        return heat ? (
          <CircleMarker
            key={event.id}
            center={[event.latitude, event.longitude]}
            radius={isStrongest ? Math.max(16, event.magnitude * 6) : Math.max(8, event.magnitude * 5)}
            pathOptions={{
              color: isStrongest ? '#ffffff' : markerColor(event.magnitude),
              fillColor: isStrongest ? '#ef4444' : markerColor(event.magnitude),
              fillOpacity: isStrongest ? 0.42 : 0.22,
              weight: isStrongest ? 3 : 1,
            }}
            eventHandlers={{ click: () => onSelect(event) }}
          >
            <EventPopup event={event} isStrongest={isStrongest} onSelect={onSelect} onDetails={onDetails} />
          </CircleMarker>
        ) : (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={rippleIcon(event, isStrongest)}
            eventHandlers={{ click: () => onSelect(event) }}
          >
            <EventPopup event={event} isStrongest={isStrongest} onSelect={onSelect} onDetails={onDetails} />
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
}

function EventPopup({ event, isStrongest, onSelect, onDetails }: EventPopupProps) {
  return (
    <Popup
      className={`geopulse-popup quake-popup ${isStrongest ? 'tier-strongest' : tierClass(event.magnitude)}`}
      minWidth={190}
      maxWidth={210}
      autoPan
      autoPanPaddingTopLeft={[20, 40]}
      autoPanPaddingBottomRight={[20, 20]}
      closeButton={false}
      eventHandlers={{ add: repositionPopup }}
    >
      <MapPopup event={event} isStrongest={isStrongest} onSelect={onSelect} onDetails={onDetails} />
    </Popup>
  );
}
