import { useEffect, useMemo, useState } from 'react';
import { Earthquake } from '../../../types';
import { countryOf, fmtDate } from '../../../components/dashboard/data';
import { FlyTarget, SearchPin, UserPosition } from '../../../components/map/MapCanvas';
import { MapTileKey } from '../../../components/map/mapStyles';

export function useMapControls(earthquakes: Earthquake[], globalSearch: string, setSelectedId: (id: string | null) => void) {
  const [query, setQuery] = useState('');
  const [minMag, setMinMag] = useState(0);
  const [tile, setTile] = useState<MapTileKey>('dark');
  const [heat, setHeat] = useState(false);
  const [plates, setPlates] = useState(false);
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [searchPin, setSearchPin] = useState<SearchPin | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => setQuery(globalSearch), [globalSearch]);
  const q = query.toLowerCase().trim();
  const events = useMemo(() => earthquakes.filter((event) => {
    const text = `${event.place} ${countryOf(event.place)} ${event.id} ${event.magnitude} ${event.depth} ${event.alert ?? ''} ${event.status} ${fmtDate(event.time, 'UTC')}`.toLowerCase();
    return event.magnitude >= minMag && (!q || text.includes(q));
  }), [earthquakes, minMag, q]);

  const locateMe = () => {
    if (!navigator.geolocation) return setLocateError('Geolocation is not supported in this browser.');
    setIsLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserPosition({ lat: latitude, lng: longitude, accuracy });
        setFlyTarget({ lat: latitude, lng: longitude, zoom: 11, nonce: Date.now() });
        setIsLocating(false);
      },
      (err) => {
        setLocateError(err.code === err.PERMISSION_DENIED ? 'Location permission denied.' : 'Unable to retrieve your location.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const searchPlace = async () => {
    const term = query.trim();
    if (!term) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(term)}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Geocoding request failed');
      const results = await res.json();
      if (!results.length) return setSearchError(`No location found for "${term}".`);
      const latNum = Number(results[0].lat);
      const lonNum = Number(results[0].lon);
      if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) throw new Error('Invalid geocoding coordinates');
      setSearchPin({ lat: latNum, lng: lonNum, label: results[0].display_name });
      setFlyTarget({ lat: latNum, lng: lonNum, zoom: 6, nonce: Date.now() });
    } catch {
      setSearchError('Search failed. Try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const resetMap = () => {
    setSearchPin(null);
    setSelectedId(null);
    setFlyTarget({ lat: 20, lng: 0, zoom: 2, nonce: Date.now() });
  };

  return {
    events, tile, heat, plates, flyTarget, userPosition, searchPin,
    controlPanelProps: {
      query, minMag, tile, heat, plates,
      onQuery: setQuery, onMinMag: setMinMag, onTile: setTile,
      onHeat: setHeat, onPlates: setPlates, onSearchSubmit: searchPlace,
      onClearSearchPin: () => setSearchPin(null), hasSearchPin: !!searchPin,
      isSearching, searchError, onLocateMe: locateMe, isLocating, locateError,
      onResetMap: resetMap,
    },
  };
}
