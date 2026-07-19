import { Earthquake } from '../../types';
import { alertStyle, depthStyle, magnitudeStyle } from './colors';
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
  return (
    <div className="min-w-64 space-y-3 rounded-2xl bg-slate-950/95 p-4 text-white shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <Badge className={magnitudeStyle(event.magnitude)}>M {event.magnitude.toFixed(1)}</Badge>
        <Badge className={alertStyle(event.alert)}>{event.alert ?? 'No Alert'}</Badge>
      </div>
      <div>
        <h3 className="text-base font-black">{regionOf(event.place)}</h3>
        <p className="text-xs font-semibold text-cyan-100">{countryOf(event.place)}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Info label="Depth" value={`${event.depth.toFixed(1)} km`} tone={depthStyle(event.depth)} />
        <Info label="Time" value={fmtDate(event.time, 'UTC')} />
        <Info label="Lat/Lng" value={`${event.latitude.toFixed(2)}, ${event.longitude.toFixed(2)}`} />
        <Info label="Risk" value={event.magnitude >= 6 ? 'High' : event.magnitude >= 5 ? 'Moderate' : 'Low'} />
      </div>
      <button onClick={() => (onDetails ?? onSelect)(event)} className="w-full rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-red-500">
        View Details
      </button>
    </div>
  );
}

function Info({ label, value, tone = 'text-white' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-2">
      <p className="text-[10px] uppercase tracking-widest text-slate-300">{label}</p>
      <p className={`mt-1 font-black ${tone}`}>{value}</p>
    </div>
  );
}
