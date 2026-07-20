import { useEffect, useMemo, useState } from 'react';
import { Radar, Target, Gauge } from 'lucide-react';
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
        <Summary
          icon={<Target className="h-4 w-4" />}
          label="Within Radius"
          value={nearby.length}
          gradient="from-cyan-500 via-sky-600 to-blue-600"
          tint="from-cyan-50 to-sky-50"
          border="border-cyan-200"
        />
        <Summary
          icon={<Radar className="h-4 w-4" />}
          label="Closest Event"
          value={nearby[0] ? `${nearby[0].distance.toFixed(0)} km` : 'N/A'}
          gradient="from-fuchsia-500 via-pink-600 to-rose-600"
          tint="from-fuchsia-50 to-rose-50"
          border="border-fuchsia-200"
        />
        <Summary
          icon={<Gauge className="h-4 w-4" />}
          label="Radius"
          value={`${radius} km`}
          gradient="from-amber-500 via-orange-600 to-red-600"
          tint="from-amber-50 to-orange-50"
          border="border-amber-200"
        />
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

function Summary({
  icon, label, value, gradient, tint, border,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
  tint: string;
  border: string;
}) {
  return (
   <article className={`group relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${tint} p-5 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl`}>
  <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-20`} />

  <div className="relative flex items-center gap-2">
    <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
      {icon}
    </span>
    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
  </div>

  <strong className="relative mt-3 block font-serif text-3xl font-black italic tracking-tight text-slate-900">
    {value}
  </strong>
</article>
  );
}