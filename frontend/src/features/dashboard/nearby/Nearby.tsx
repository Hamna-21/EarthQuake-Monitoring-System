import { useEffect, useMemo, useState } from 'react';
import { Radar, Target, Gauge } from 'lucide-react';
import { Earthquake } from '@/types';
import { countryOf, fmtDate, haversineKm } from '@/features/dashboard/utils/data';
import { DashboardProps } from '@/features/dashboard/types';
import EmptyState from '@/features/dashboard/components/EmptyState';
import LocationCard from '@/features/dashboard/nearby/components/LocationCard';
import NearbyEarthquakeCard from '@/features/dashboard/nearby/components/NearbyEarthquakeCard';
import RadiusControl from '@/features/dashboard/nearby/components/RadiusControl';
import { UserLocation, directionFromUser, reverseLocation } from '@/features/dashboard/nearby/utils/nearbyUtils';
import NearbySummaryCard from '@/features/dashboard/nearby/components/NearbySummaryCard';
import PageBackButton from '@/features/dashboard/components/PageBackButton';
import { useDashboardPageState } from '@/features/dashboard/hooks/DashboardStateContext';

export default function NearbyPage({ earthquakes, setSelectedId, openPage, globalSearch = '', highlightedEventId }: DashboardProps) {
  const [location, setLocation] = useDashboardPageState<UserLocation | null>('nearby-location', null);
  const [radius, setRadius] = useDashboardPageState('nearby-radius', 250, true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location access.');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          setLocation(await reverseLocation(lat, lon));
        } catch {
          setLocation({ lat, lon, label: `${lat.toFixed(3)}, ${lon.toFixed(3)}` });
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setError(err.code === err.PERMISSION_DENIED ? 'Location permission was denied.' : 'Unable to find your location.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  useEffect(() => { if (!location) locate(); }, []);

  const nearby = useMemo(() => {
    if (!location) return [];
    const q = globalSearch.trim().toLowerCase();
    return earthquakes
      .map((event) => ({
        ...event,
        distance: haversineKm(location, { lat: event.latitude, lon: event.longitude }),
        direction: directionFromUser(event.latitude - location.lat, event.longitude - location.lon),
      }))
      .filter((event) => {
        const text = `${event.place} ${countryOf(event.place)} ${event.id} ${event.magnitude} ${event.alert ?? ''} ${event.status} ${fmtDate(event.time, 'UTC')}`.toLowerCase();
        return event.distance <= radius && (!q || text.includes(q));
      })
      .sort((a, b) => a.distance - b.distance);
  }, [earthquakes, location, radius, globalSearch]);

  const select = (event: Earthquake) => { setSelectedId(event.id); openPage('details'); };

  const summary = [
    { icon: <Target className="h-4 w-4" />, label: 'Within Radius', value: nearby.length, gradient: 'from-cyan-500 to-blue-600', border: 'border-cyan-400/25' },
    { icon: <Radar className="h-4 w-4" />, label: 'Closest Event', value: nearby[0] ? `${nearby[0].distance.toFixed(0)} km` : 'N/A', gradient: 'from-fuchsia-500 to-rose-600', border: 'border-fuchsia-400/25' },
    { icon: <Gauge className="h-4 w-4" />, label: 'Radius', value: `${radius} km`, gradient: 'from-amber-500 to-orange-600', border: 'border-amber-400/25' },
  ];

  return (
    <section className="space-y-4">
      <div className="flex justify-end">
        <PageBackButton label="Close" onClick={() => openPage('overview')} />
      </div>
      <LocationCard location={location} error={error} locating={locating} onLocate={locate} />
      <RadiusControl radius={radius} onChange={setRadius} />

      <div className="grid gap-3 md:grid-cols-3">
        {summary.map((s) => <NearbySummaryCard key={s.label} {...s} />)}
      </div>

      {!nearby.length ? (
        <EmptyState title="No Nearby Earthquakes" text="No loaded earthquake records fall inside the selected radius." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {nearby.map((event) => <NearbyEarthquakeCard key={event.id} event={event} highlighted={event.id === highlightedEventId} onSelect={select} />)}
        </div>
      )}
    </section>
  );
}
