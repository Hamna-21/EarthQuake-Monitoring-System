import { Circle, Marker, Polyline, Popup } from 'react-leaflet';
import { plateLines } from '@/features/dashboard/map/components/plateBoundaries';
import { SearchPin, UserPosition } from '@/features/dashboard/map/components/MapCanvas';
import { searchPinIcon, userLocationIcon } from '@/features/dashboard/map/components/mapRuntime';

interface MapAuxiliaryLayersProps {
  plates: boolean;
  userPosition?: UserPosition | null;
  searchPin?: SearchPin | null;
}

/** Adds optional tectonic lines, user-position accuracy, and searched-place context to the base map. */
export default function MapAuxiliaryLayers({ plates, userPosition, searchPin }: MapAuxiliaryLayersProps) {
  return (
    <>
      {plates && plateLines.map((line) => (
        <Polyline key={line.name} positions={line.points} pathOptions={{ color: '#fb923c', opacity: 0.72, weight: 2 }} />
      ))}
      {userPosition && (
        <>
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userLocationIcon()}>
            <Popup className="geopulse-popup" minWidth={160} maxWidth={200} autoPan closeButton>You are here</Popup>
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
          <Popup className="geopulse-popup" minWidth={220} maxWidth={280} autoPan closeButton>{searchPin.label}</Popup>
        </Marker>
      )}
    </>
  );
}
