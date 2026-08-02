import { useEffect, useMemo, useState } from 'react';
import { Radar, Target, Gauge } from 'lucide-react';
import { Earthquake } from '../../../types';
import { countryOf, fmtDate, haversineKm } from '../../../components/dashboard/data';
import { DashboardProps } from '../../../components/dashboard/types';
import EmptyState from '../../../components/dashboard/EmptyState';
import LocationCard from './LocationCard';
import NearbyEarthquakeCard from './NearbyEarthquakeCard';
import RadiusControl from './RadiusControl';
import { UserLocation, directionFromUser, reverseLocation } from './nearbyUtils';
import NearbySummaryCard from './NearbySummaryCard';

export default function NearbyPage({ earthquakes, setSelectedId, openPage, globalSearch = '', highlightedEventId }: DashboardProps) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [radius, setRadius] = useState(250);
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
          setLocation({ lat, lon });
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

  useEffect(() => {
    locate();
  }, []);

  const nearby = useMemo(() => {
    if (!location) return [];
    const q = globalSearch.trim().toLowerCase();
    return earthquakes
      .map((event) => {
        const distance = haversineKm(location, { lat: event.latitude, lon: event.longitude });
        return {
          ...event,
          distance,
          direction: directionFromUser(event.latitude - location.lat, event.longitude - location.lon),
        };
      })
      .filter((event) => {
        const text = `${event.place} ${countryOf(event.place)} ${event.id} ${event.magnitude} ${event.alert ?? ''} ${event.status} ${fmtDate(event.time, 'UTC')}`.toLowerCase();
        return event.distance <= radius && (!q || text.includes(q));
      })
      .sort((a, b) => a.distance - b.distance);
  }, [earthquakes, location, radius, globalSearch]);

  const select = (event: Earthquake) => {
    setSelectedId(event.id);
    openPage('details');
  };

  return (
    <section className="space-y-6">
      <LocationCard location={location} error={error} locating={locating} onLocate={locate} />
      <RadiusControl radius={radius} onChange={setRadius} />

      <div className="grid gap-4 md:grid-cols-3">
        <NearbySummaryCard
          icon={<Target className="h-4 w-4" />}
          label="Within Radius"
          value={nearby.length}
          gradient="from-cyan-500 via-sky-600 to-blue-600"
          tint="from-cyan-500/15 to-sky-500/5"
          border="border-cyan-300/20"
        />
        <NearbySummaryCard
          icon={<Radar className="h-4 w-4" />}
          label="Closest Event"
          value={nearby[0] ? `${nearby[0].distance.toFixed(0)} km` : 'N/A'}
          gradient="from-fuchsia-500 via-pink-600 to-rose-600"
          tint="from-fuchsia-500/15 to-rose-500/5"
          border="border-fuchsia-300/20"
        />
        <NearbySummaryCard
          icon={<Gauge className="h-4 w-4" />}
          label="Radius"
          value={`${radius} km`}
          gradient="from-amber-500 via-orange-600 to-red-600"
          tint="from-amber-500/15 to-orange-500/5"
          border="border-amber-300/20"
        />
      </div>

      {!nearby.length ? (
        <EmptyState title="No Nearby Earthquakes" text="No loaded earthquake records fall inside the selected radius." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {nearby.map((event) => <NearbyEarthquakeCard key={event.id} event={event} highlighted={event.id === highlightedEventId} onSelect={select} />)}
        </div>
      )}
    </section>
  );
}

