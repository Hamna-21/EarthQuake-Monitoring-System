import { ArrowUpRight, Compass } from 'lucide-react';
import { Earthquake } from '@/types';
import { magnitudeStyle, distanceStyle } from '@/features/dashboard/utils/colors';
import { fmtDate } from '@/features/dashboard/utils/data';
import { placeParts } from '@/features/dashboard/nearby/utils/nearbyUtils';

type NearbyEvent = Earthquake & { distance: number; direction: string };

const SEVERITY = [
  { min: 6, chip: 'bg-rose-500/15 text-rose-200 border-rose-400/30' },
  { min: 5, chip: 'bg-amber-500/15 text-amber-200 border-amber-400/30' },
  { min: 0, chip: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30' },
];
const sevOf = (m: number) => SEVERITY.find((s) => m >= s.min)!;

/** Renders or coordinates nearby earthquake card for this frontend module. */
export default function NearbyEarthquakeCard({ event, onSelect, highlighted = false }: { event: NearbyEvent; onSelect: (e: Earthquake) => void; highlighted?: boolean }) {
  const place = placeParts(event.place);
  const sev = sevOf(event.magnitude);

  return (
    <article className={`rounded-xl border bg-white/[0.06] p-3 backdrop-blur-xl transition hover:bg-white/[0.1] ${highlighted ? 'border-cyan-300/60 ring-1 ring-cyan-300/30' : 'border-white/10'}`}>
      <div className="flex items-start gap-3">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border font-serif text-sm font-black ${sev.chip}`}>
          {event.magnitude.toFixed(1)}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <p className="flex items-start gap-1 text-[13px] font-bold leading-snug text-white">
            <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="break-words">{place.city}, {place.country}</span>
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{fmtDate(event.time, 'UTC')}</span>
            <span className={`rounded-full border px-2 py-0.5 font-bold ${distanceStyle(event.distance)}`}>{event.distance.toFixed(0)} km</span>
          </div>

          <button
            onClick={() => onSelect(event)}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-950/80 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-cyan-600/80"
          >
            View details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
/** Displays one nearby earthquake with distance and event context. */
