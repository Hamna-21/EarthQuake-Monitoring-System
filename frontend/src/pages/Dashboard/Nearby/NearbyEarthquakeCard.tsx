import { ArrowUpRight } from 'lucide-react';
import { Earthquake } from '../../../types';
import { alertStyle, distanceStyle, magnitudeStyle } from '../../../components/dashboard/colors';
import { fmtDate } from '../../../components/dashboard/data';
import { placeParts } from './nearbyUtils';

type NearbyEvent = Earthquake & { distance: number; direction: string };

interface NearbyEarthquakeCardProps {
  event: NearbyEvent;
  onSelect: (event: Earthquake) => void;
}

export default function NearbyEarthquakeCard({ event, onSelect }: NearbyEarthquakeCardProps) {
  const place = placeParts(event.place);

  return (
    <article className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <span className={`rounded-2xl border px-4 py-3 text-xl font-black ${magnitudeStyle(event.magnitude)}`}>
          M {event.magnitude.toFixed(1)}
        </span>
        <span className={`rounded-full border px-3 py-1 text-xs font-black ${distanceStyle(event.distance)}`}>
          {event.distance.toFixed(0)} km Away
        </span>
      </div>
      <h3 className="mt-5 text-xl font-black text-slate-950">{place.city}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-500">{place.country} | {event.direction}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Info label="Depth" value={`${event.depth.toFixed(1)} km`} />
        <Info label="Date" value={fmtDate(event.time, 'UTC')} />
        <Info label="Alert" value={event.alert ?? 'No alert'} tone={alertStyle(event.alert)} />
        <Info label="Risk" value={event.magnitude >= 6 ? 'High' : event.magnitude >= 5 ? 'Moderate' : 'Low'} />
      </div>
      <button onClick={() => onSelect(event)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700">
        View Details <ArrowUpRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function Info({ label, value, tone = 'text-slate-800' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className={`mt-1 text-sm font-black ${tone}`}>{value}</p>
    </div>
  );
}
