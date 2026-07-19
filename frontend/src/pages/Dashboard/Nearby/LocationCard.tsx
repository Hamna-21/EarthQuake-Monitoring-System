import { LocateFixed } from 'lucide-react';
import { UserLocation } from './nearbyUtils';

interface LocationCardProps {
  location: UserLocation | null;
  error: string | null;
  locating: boolean;
  onLocate: () => void;
}

export default function LocationCard({ location, error, locating, onLocate }: LocationCardProps) {
  const title = [location?.city, location?.country].filter(Boolean).join(', ');

  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-700">Your Current Location</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950">{title || 'Location pending'}</h2>
          {location && (
            <p className="mt-2 text-sm font-semibold text-slate-600">
              Latitude: {location.lat.toFixed(6)} | Longitude: {location.lon.toFixed(6)}
            </p>
          )}
          {location?.region && <p className="mt-1 text-sm text-slate-500">{location.region}</p>}
          {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-800">{error}</p>}
        </div>
        <button onClick={onLocate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-sm font-black text-white transition hover:bg-red-800">
          <LocateFixed className="h-4 w-4" /> {locating ? 'Detecting...' : 'Refresh Location'}
        </button>
      </div>
    </section>
  );
}
