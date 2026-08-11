import { LocateFixed, MapPin } from 'lucide-react';
import { UserLocation } from '@/features/dashboard/nearby/utils/nearbyUtils';

export default function LocationCard({ location, error, locating, onLocate }: { location: UserLocation | null; error: string | null; locating: boolean; onLocate: () => void }) {
  const title = location?.label || [location?.city, location?.country].filter(Boolean).join(', ');

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-cyan-300">
            <MapPin className="h-3.5 w-3.5" /> Your Location
          </p>
          <h2 className="mt-1 truncate text-lg font-black text-white">{title || 'Location pending'}</h2>
          {location && (
            <p className="mt-0.5 text-xs text-slate-500">{location.lat.toFixed(3)}, {location.lon.toFixed(3)}</p>
          )}
          {error && <p className="mt-2 rounded-lg border border-rose-400/30 bg-rose-500/10 px-2 py-1 text-xs font-bold text-rose-300">{error}</p>}
        </div>
        <button
          onClick={onLocate}
          disabled={locating}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30 px-3 py-1.5 text-xs font-bold text-cyan-100 transition hover:bg-cyan-500/25 disabled:opacity-60"
        >
          <LocateFixed className={`h-3.5 w-3.5 ${locating ? 'animate-spin' : ''}`} />
          {locating ? 'Detecting…' : 'Refresh'}
        </button>
      </div>
    </section>
  );
}