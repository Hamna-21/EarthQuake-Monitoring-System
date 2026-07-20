import { Earthquake } from '../../types';
import { alertStyle, depthStyle } from './colors';
import { countryOf, fmtDate } from './data';
import Badge from './Badge';

interface MapPopupProps {
  event: Earthquake;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
}

function regionOf(place: string) {
  const parts = place.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts.slice(0, -1).join(', ') : place;
}

export default function MapPopup({ event, onSelect, onDetails }: MapPopupProps) {
  const risk = event.magnitude >= 6 ? 'High' : event.magnitude >= 5 ? 'Moderate' : 'Low';
  const riskTone =
    event.magnitude >= 6 ? 'text-rose-600' : event.magnitude >= 5 ? 'text-amber-600' : 'text-emerald-600';
  const tierGradient =
    event.magnitude >= 6
      ? 'from-rose-400 via-red-400 to-orange-400'
      : event.magnitude >= 5
      ? 'from-amber-300 via-orange-400 to-rose-400'
      : 'from-emerald-300 via-teal-400 to-cyan-400';
  const tierSoftBg =
    event.magnitude >= 6 ? 'bg-rose-50' : event.magnitude >= 5 ? 'bg-amber-50' : 'bg-emerald-50';

  return (
    <div className="w-[620px] max-w-[92vw] overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl ring-1 ring-slate-200">
      <div className={`h-1.5 w-full bg-gradient-to-r ${tierGradient}`} />

      {/* Single horizontal row: dial | place | stats | action */}
      <div className="flex items-center gap-3 p-3">
        {/* Magnitude dial — compact square, not a tall column */}
        <div className={`flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-gradient-to-br ${tierGradient} shadow-md`}>
          <span className="text-[9px] font-black uppercase tracking-widest text-white/85">Mag</span>
          <span className="text-2xl font-black leading-none text-white">{event.magnitude.toFixed(1)}</span>
          <span className="mt-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[8px] font-black uppercase text-slate-700">
            {risk}
          </span>
        </div>

        {/* Place name + country + alert badge */}
        <div className="w-36 min-w-0 flex-shrink-0 border-l border-slate-100 pl-3">
          <h3 className="line-clamp-2 text-[13px] font-black leading-tight text-slate-900" title={regionOf(event.place)}>
            {regionOf(event.place)}
          </h3>
          <p className="mt-0.5 truncate text-[11px] font-semibold text-cyan-600">{countryOf(event.place)}</p>
          <Badge className={`${alertStyle(event.alert)} mt-1 inline-block`}>{event.alert ?? 'No Alert'}</Badge>
        </div>

        {/* Compact inline stat chips — no more stacked boxes */}
        <div className="flex flex-1 flex-wrap items-center gap-2 border-l border-slate-100 pl-3">
          <Stat label="Depth" value={`${event.depth.toFixed(1)} km`} tone={depthStyle(event.depth)} bg={tierSoftBg} />
          <Stat label="Risk" value={risk} tone={riskTone} bg={tierSoftBg} />
          <Stat label="Time" value={fmtDate(event.time, 'UTC')} bg={tierSoftBg} />
          <Stat label="Lat / Lng" value={`${event.latitude.toFixed(2)}, ${event.longitude.toFixed(2)}`} bg={tierSoftBg} />
        </div>

        {/* Action button — fixed width, sits at the end of the row */}
        <button
          onClick={() => (onDetails ?? onSelect)(event)}
          className={`flex-shrink-0 rounded-xl bg-gradient-to-r ${tierGradient} px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-md transition hover:brightness-105`}
        >
          Details
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = 'text-slate-700',
  bg = 'bg-slate-50',
}: {
  label: string;
  value: string;
  tone?: string;
  bg?: string;
}) {
  return (
    <div className={`rounded-lg ${bg} px-2.5 py-1.5 ring-1 ring-slate-200`}>
      <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`whitespace-nowrap text-[11px] font-black ${tone}`} title={value}>
        {value}
      </p>
    </div>
  );
}