import { CalendarDays, Clock3, Gauge, Layers, ShieldCheck, Waves } from 'lucide-react';
import type { Earthquake } from '../../types';

interface MapPopupProps {
  event: Earthquake;
  isStrongest?: boolean;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
  mode?: 'compact' | 'historical';
}

function splitDateTime(time: string) {
  const parsed = Date.parse(time);
  if (!Number.isFinite(parsed)) return { date: 'Unavailable', clock: 'Unavailable' };
  const eventDate = new Date(parsed);
  return {
    date: new Intl.DateTimeFormat('en', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(eventDate),
    clock: `${new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }).format(eventDate)} UTC`,
  };
}

const alertText = (alert: Earthquake['alert']) => alert ? alert.toUpperCase() : 'Not recorded';
const tsunamiText = (event: Earthquake) => event.tsunamiCode === 1 || event.tsunami ? 'Yes' : event.tsunamiCode === 0 ? 'No' : 'Not recorded';

export default function MapPopup({ event, isStrongest = false, onSelect, onDetails, mode = 'compact' }: MapPopupProps) {
  const { date, clock } = splitDateTime(event.time);
  const openDetails = () => {
    onSelect(event);
    onDetails?.(event);
  };

  return (
    <article className={`${mode === 'historical' ? 'w-[230px]' : 'w-[190px]'} max-w-[72vw] rounded-lg border ${isStrongest ? 'border-red-400/45' : 'border-cyan-500/20'} bg-[#071321] p-2 font-serif text-white shadow-2xl shadow-black/40`}>
      {isStrongest && (
        <div className="mb-1.5 rounded-md bg-red-500/15 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.1em] text-red-200">
          Strongest in View
        </div>
      )}
      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan-300/70">Location</p>
      <h3 className="mt-1 line-clamp-2 min-h-[30px] text-[11px] font-black leading-snug text-slate-100">
        {event.place || 'Unknown location'}
      </h3>

      <div className="mt-2 space-y-1.5">
        <InfoRow icon={<Gauge />} label="Magnitude">
          <span className="rounded-full bg-teal-400 px-2 py-0.5 text-[10px] font-black text-white shadow-sm shadow-teal-900/40">
            M {event.magnitude.toFixed(1)}
          </span>
        </InfoRow>
        <InfoRow icon={<CalendarDays />} label="Date">
          <span>{date}</span>
        </InfoRow>
        <InfoRow icon={<Clock3 />} label="Time">
          <span>{clock}</span>
        </InfoRow>
        {mode === 'historical' && <>
          <InfoRow icon={<Layers />} label="Depth"><span>{Number.isFinite(event.depth) ? `${event.depth.toFixed(1)} km` : 'Unknown'}</span></InfoRow>
          <InfoRow icon={<ShieldCheck />} label="Alert"><span>{alertText(event.alert)}</span></InfoRow>
          <InfoRow icon={<Waves />} label="Tsunami"><span>{tsunamiText(event)}</span></InfoRow>
        </>}
      </div>

      <button
        type="button"
        onClick={openDetails}
        className="mt-2 w-full rounded-md bg-teal-400 px-3 py-1.5 text-[9px] font-black text-white shadow-lg shadow-teal-950/40 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-200"
      >
        View Details
      </button>
    </article>
  );
}

function InfoRow({ icon, label, children }: { icon?: React.ReactElement; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[32px] items-center justify-between gap-2 rounded-md bg-white/[0.06] px-2 py-1.5">
      <span className="flex min-w-0 items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">
        {icon && <span className="text-slate-500 [&>svg]:h-3 [&>svg]:w-3">{icon}</span>}
        {label}
      </span>
      <span className="shrink-0 text-[10px] font-black text-slate-100">{children}</span>
    </div>
  );
}
