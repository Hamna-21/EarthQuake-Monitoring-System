import { ArrowUpRight, Compass, Layers, CalendarClock, AlertTriangle, Gauge } from 'lucide-react';
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

  const severity =
    event.magnitude >= 6
      ? {
          gradient: 'from-rose-500 via-red-600 to-orange-600',
          tint: 'from-rose-50 via-white to-orange-50',
          border: 'border-rose-200',
          glow: 'bg-rose-400/20',
        }
      : event.magnitude >= 5
      ? {
          gradient: 'from-amber-500 via-orange-600 to-red-600',
          tint: 'from-amber-50 via-white to-orange-50',
          border: 'border-amber-200',
          glow: 'bg-amber-400/20',
        }
      : {
          gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
          tint: 'from-emerald-50 via-white to-cyan-50',
          border: 'border-emerald-200',
          glow: 'bg-emerald-400/20',
        };

  const risk = event.magnitude >= 6 ? 'High' : event.magnitude >= 5 ? 'Moderate' : 'Low';

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border ${severity.border} bg-gradient-to-br ${severity.tint} p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${severity.glow} blur-3xl transition-opacity group-hover:opacity-80`} />

      <div className="relative flex items-start justify-between gap-4">
        <span className={`rounded-2xl border px-4 py-3 text-xl font-black ${magnitudeStyle(event.magnitude)}`}>
          M {event.magnitude.toFixed(1)}
        </span>
        <span className={`rounded-full border px-3 py-1 font-mono text-[11px] font-black tracking-wide ${distanceStyle(event.distance)}`}>
          {event.distance.toFixed(0)} KM AWAY
        </span>
      </div>

      <h3
        className={`relative mt-5 truncate bg-gradient-to-r ${severity.gradient} bg-clip-text font-serif text-2xl font-black italic tracking-tight text-transparent`}
        title={place.city}
      >
        {place.city}
      </h3>
      <p className="relative mt-1 flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wide text-slate-500">
        {place.country}
        <Compass className="h-3.5 w-3.5 text-violet-500" />
        {event.direction}
      </p>

      <div className="relative mt-5 grid grid-cols-2 gap-3 text-sm">
        <Info icon={<Layers className="h-3.5 w-3.5" />} label="Depth" value={`${event.depth.toFixed(1)} km`} gradient="from-orange-500 to-amber-600" tint="bg-orange-50" />
        <Info icon={<CalendarClock className="h-3.5 w-3.5" />} label="Date" value={fmtDate(event.time, 'UTC')} gradient="from-cyan-500 to-sky-600" tint="bg-cyan-50" />
        <Info icon={<AlertTriangle className="h-3.5 w-3.5" />} label="Alert" value={event.alert ?? 'No alert'} gradient="from-violet-500 to-fuchsia-600" tint="bg-violet-50" />
        <Info
          icon={<Gauge className="h-3.5 w-3.5" />}
          label="Risk"
          value={risk}
          gradient={severity.gradient}
          tint="bg-slate-50"
        />
      </div>

      <button
        onClick={() => onSelect(event)}
        className={`relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${severity.gradient} px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-white shadow-md transition hover:brightness-110 active:scale-95`}
      >
        View Details <ArrowUpRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function Info({
  icon, label, value, gradient, tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
  tint: string;
}) {
  return (
    <div className={`rounded-2xl ${tint} p-3`}>
      <p className="flex items-center gap-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {icon}
        {label}
      </p>
      <p
        className={`mt-1 truncate bg-gradient-to-r ${gradient} bg-clip-text text-sm font-black text-transparent`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}