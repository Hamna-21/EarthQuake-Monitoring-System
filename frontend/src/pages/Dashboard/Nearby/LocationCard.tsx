import { LocateFixed, MapPin } from 'lucide-react';
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
    <section className="relative overflow-hidden rounded-lg border border-cyan-500/20 bg-slate-950 p-6 shadow-2xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-fuchsia-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
            <MapPin className="h-3.5 w-3.5" /> Your Current Location
          </p>
          <h2 className="mt-3 truncate bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text font-serif text-3xl font-black italic tracking-tight text-transparent">
            {title || 'Location pending'}
          </h2>
          {location && (
            <p className="mt-2 text-sm font-semibold text-slate-400">
              Latitude: {location.lat.toFixed(6)} | Longitude: {location.lon.toFixed(6)}
            </p>
          )}
          {location?.region && <p className="mt-1 text-sm text-slate-500">{location.region}</p>}
          {error && (
            <p className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-bold text-rose-300">
              {error}
            </p>
          )}
        </div>
        <button
          onClick={onLocate}
          disabled={locating}
          className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-cyan-900/40 transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LocateFixed className={`h-4 w-4 ${locating ? 'animate-spin' : ''}`} /> {locating ? 'Detecting...' : 'Refresh Location'}
        </button>
      </div>
    </section>
  );
}