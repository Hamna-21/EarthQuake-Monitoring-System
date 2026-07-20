import { useMemo, useState } from 'react';
import { Compass, Radio } from 'lucide-react';
import { Earthquake } from '../../../types';
import MapCanvas, { FlyTarget, SearchPin, UserPosition } from '../../../components/dashboard/MapCanvas';
import { MapTileKey } from '../../../components/dashboard/mapStyles';
import { DashboardProps } from '../../../components/dashboard/types';
import { RefreshNote } from '../../../components/dashboard/Shell';
import MapControlPanel from './components/MapControlPanel';

export default function MapPage({ earthquakes, selectedEvent, setSelectedId, openPage, isLoading, dataError }: DashboardProps) {
  const [minMag, setMinMag] = useState(0);
  const [query, setQuery] = useState('');
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

  const q = query.toLowerCase().trim();
  const events = useMemo(() => earthquakes.filter((event) => {
    const text = `${event.place} ${event.magnitude} ${event.depth}`.toLowerCase();
    return event.magnitude >= minMag && (!q || text.includes(q));
  }), [earthquakes, minMag, q]);
  const select = (event: Earthquake) => setSelectedId(event.id);

  const locateMe = () => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported in this browser.');
      return;
    }
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
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(term)}`, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Geocoding request failed');
      const results = await res.json();
      if (!results.length) {
        setSearchError(`No location found for "${term}".`);
        setIsSearching(false);
        return;
      }
      const { lat, lon, display_name } = results[0];
      const latNum = Number(lat);
      const lonNum = Number(lon);
      setSearchPin({ lat: latNum, lng: lonNum, label: display_name });
      setFlyTarget({ lat: latNum, lng: lonNum, zoom: 6, nonce: Date.now() });
    } catch {
      setSearchError('Search failed. Try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const controlPanelProps = {
    query, minMag, tile, heat, plates,
    onQuery: setQuery, onMinMag: setMinMag, onTile: setTile, onHeat: setHeat, onPlates: setPlates,
    onSearchSubmit: searchPlace, onClearSearchPin: () => setSearchPin(null), hasSearchPin: !!searchPin,
    isSearching, searchError, onLocateMe: locateMe, isLocating, locateError,
  };

  return (
    <section className="space-y-4">
      <div className="relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-lg border border-cyan-500/20 bg-slate-950 px-6 py-4 shadow-2xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="relative min-w-0">
          <p className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
            <Compass className="h-3.5 w-3.5" /> Global Earthquake Intelligence
          </p>
          <h1 className="mt-1.5 truncate bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text font-serif text-2xl font-black italic tracking-tight text-transparent sm:text-3xl">
            The world, mapped in real time.
          </h1>
        </div>

        <div className="relative flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-black text-emerald-200">
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          Live Connection
        </div>
      </div>

      <RefreshNote isLoading={isLoading} error={dataError} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          
        </div>
      </div>

      <MapControlPanel {...controlPanelProps} />

      <div className="h-[65vh] min-h-[480px] overflow-hidden rounded-3xl border border-cyan-500/20">
        <MapCanvas
          events={events}
          selectedId={selectedEvent?.id}
          onSelect={select}
          onDetails={(event) => { setSelectedId(event.id); openPage('details'); }}
          tile={tile}
          heat={heat}
          plates={plates}
          flyTarget={flyTarget}
          userPosition={userPosition}
          searchPin={searchPin}
        />
      </div>
    </section>
  );
}