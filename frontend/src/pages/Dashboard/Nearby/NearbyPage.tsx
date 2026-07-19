import { useEffect, useMemo, useState } from 'react';
import { Earthquake } from '../../../types';
import { haversineKm } from '../../../components/dashboard/data';
import { DashboardProps } from '../../../components/dashboard/types';
import EmptyState from '../../../components/dashboard/EmptyState';
import LocationCard from './LocationCard';
import NearbyEarthquakeCard from './NearbyEarthquakeCard';
import RadiusControl from './RadiusControl';
import { UserLocation, directionFromUser, reverseLocation } from './nearbyUtils';

export default function NearbyPage({ earthquakes, setSelectedId, openPage }: DashboardProps) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [radius, setRadius] = useState(200);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = () => {
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
        setError(err.message);
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
    return earthquakes
      .map((event) => {
        const distance = haversineKm(location, { lat: event.latitude, lon: event.longitude });
        return {
          ...event,
          distance,
          direction: directionFromUser(event.latitude - location.lat, event.longitude - location.lon),
        };
      })
      .filter((event) => event.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }, [earthquakes, location, radius]);

  const select = (event: Earthquake) => {
    setSelectedId(event.id);
    openPage('details');
  };

  return (
    <section className="space-y-6">
      <LocationCard location={location} error={error} locating={locating} onLocate={locate} />
      <RadiusControl radius={radius} onChange={setRadius} />
      <div className="grid gap-4 md:grid-cols-3">
        <Summary label="Within Radius" value={nearby.length} />
        <Summary label="Closest Event" value={nearby[0] ? `${nearby[0].distance.toFixed(0)} km` : 'N/A'} />
        <Summary label="Radius" value={`${radius} km`} />
      </div>
      {!nearby.length ? (
        <EmptyState title="No Nearby Earthquakes" text="No loaded earthquake records fall inside the selected radius." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {nearby.map((event) => <NearbyEarthquakeCard key={event.id} event={event} onSelect={select} />)}
        </div>
      )}
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <strong className="mt-2 block text-3xl font-black text-slate-950">{value}</strong>
    </article>
  );
}
