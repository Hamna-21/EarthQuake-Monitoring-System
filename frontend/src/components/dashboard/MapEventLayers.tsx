import { CircleMarker, Marker, Popup } from 'react-leaflet';
import { Earthquake } from '../../types';
import MapPopup from './MapPopup';
import { markerColor } from './mapStyles';
import { repositionPopup, rippleIcon, tierClass } from './mapRuntime';

interface MapEventLayersProps {
  events: Earthquake[];
  heat: boolean;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
}

export default function MapEventLayers({ events, heat, onSelect, onDetails }: MapEventLayersProps) {
  return (
    <>
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
            <EventPopup event={event} onSelect={onSelect} onDetails={onDetails} compact />
          </CircleMarker>
        ) : (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
            icon={rippleIcon(event)}
            eventHandlers={{ click: () => onSelect(event) }}
          >
            <EventPopup event={event} onSelect={onSelect} onDetails={onDetails} />
          </Marker>
        )
      )}
    </>
  );
}

interface EventPopupProps {
  event: Earthquake;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
  compact?: boolean;
}

function EventPopup({ event, onSelect, onDetails, compact = false }: EventPopupProps) {
  return (
    <Popup
      className={`geopulse-popup ${tierClass(event.magnitude)}`}
      minWidth={compact ? 420 : 620}
      maxWidth={compact ? 460 : 660}
      autoPan
      autoPanPaddingTopLeft={[20, 40]}
      autoPanPaddingBottomRight={[20, 20]}
      closeButton
      eventHandlers={{ add: repositionPopup }}
    >
      <MapPopup event={event} onSelect={onSelect} onDetails={onDetails} />
    </Popup>
  );
}
