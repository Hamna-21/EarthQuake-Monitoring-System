import { useMemo, useState } from 'react';
import { Select } from 'antd';
import type { Earthquake } from '@/types';
import MapCanvas from '@/features/dashboard/map/components/MapCanvas';
import { mapTiles, type MapTileKey } from '@/features/dashboard/map/components/mapStyles';

/** Displays the filtered historical events on the shared map/globe and forwards marker selection. */
export default function HistoryMapSection({
  title,
  description,
  events,
  loading,
  searched,
  onSelect,
  onDetails,
  focusLocation,
}: {
  title: string;
  description: string;
  events: Earthquake[];
  loading: boolean;
  searched?: boolean;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
  focusLocation?: { lat: number; lng: number; label?: string; altitude?: number; bounds?: { south: number; north: number; west: number; east: number } } | null;
}) {
  const [tile, setTile] = useState<MapTileKey>('street');
  const viewOptions: MapTileKey[] = ['street', 'night', 'terrain'];
  const focusTarget = useMemo(() => focusLocation && !focusLocation.bounds ? { lat: focusLocation.lat, lng: focusLocation.lng, zoom: 6, nonce: 0 } : null, [focusLocation]);
  return (
    <section className="history-map">
      <div className="history-map__header">
        <div><h2 className="history-map__title">{title}</h2><p className="history-map__description">{description}</p></div>
        <label className="history-map__view"><span>View</span><Select value={tile} onChange={(value) => setTile(value as MapTileKey)} className="history-map__select" options={viewOptions.map((key) => ({ value: key, label: mapTiles[key].label }))} /></label>
      </div>
      <MapCanvas events={events} tile={tile} onSelect={onSelect} onDetails={onDetails ?? onSelect} focusTarget={focusTarget} focusBounds={focusLocation?.bounds} popupMode="historical" markerMode="flat" />
      {(loading || (searched && !events.length)) && (
        <div className="history-map__status">
          <p className="history-map__status-title">{loading ? 'Loading map records...' : 'No map markers found'}</p>
          <p className="history-map__status-detail">{loading ? 'Earthquake Monitoring System is fetching matching earthquakes.' : 'Try a wider date range, lower magnitude, or different location.'}</p>
        </div>
      )}
    </section>
  );
}
