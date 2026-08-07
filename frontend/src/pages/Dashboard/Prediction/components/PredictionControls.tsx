import { FormEvent } from 'react';
import { MapPin, Search } from 'lucide-react';

type PredictionControlsProps = {
  locationLabel: string;
  locationQuery: string;
  locationError: string | null;
  radiusKm: number;
  radiusOptions: number[];
  isDetecting: boolean;
  isSearching: boolean;
  onLocationQueryChange: (value: string) => void;
  onRadiusChange: (value: number) => void;
  onUseLocation: () => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function PredictionControls({
  locationLabel,
  locationQuery,
  locationError,
  radiusKm,
  radiusOptions,
  isDetecting,
  isSearching,
  onLocationQueryChange,
  onRadiusChange,
  onUseLocation,
  onSearchSubmit
}: PredictionControlsProps) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onUseLocation}
          disabled={isDetecting}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-gradient-to-r from-rose-500/90 to-orange-500/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-rose-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MapPin className="h-3.5 w-3.5" /> {isDetecting ? 'Detecting...' : 'Locate'}
        </button>
        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[11px] font-semibold text-slate-300">
          {locationLabel}
        </div>
      </div>

      <form onSubmit={onSearchSubmit} className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <label className="sr-only" htmlFor="prediction-city-search">Search city</label>
        <div className="flex gap-2">
          <input
            id="prediction-city-search"
            value={locationQuery}
            onChange={(event) => onLocationQueryChange(event.target.value)}
            placeholder="Rawalpindi"
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm font-semibold text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/30"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-[11px] font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Search className="h-4 w-4" /> {isSearching ? '...' : 'Go'}
          </button>
        </div>
        <div className="sm:justify-self-end">
          <label className="sr-only" htmlFor="prediction-radius">Radius</label>
          <select
            id="prediction-radius"
            value={radiusKm}
            onChange={(event) => onRadiusChange(Number(event.target.value))}
            className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-cyan-400/30 sm:w-24"
          >
            {radiusOptions.map((option) => <option key={option} value={option}>{option} km</option>)}
          </select>
        </div>
      </form>

      <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-2.5 text-[11px] font-semibold leading-5 text-slate-300">
        {locationError ?? 'Activity from nearby records only.'}
      </div>
    </aside>
  );
}
