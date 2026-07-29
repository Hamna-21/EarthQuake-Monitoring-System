import { CalendarClock, Gauge, Layers, MapPin } from 'lucide-react';
import { Earthquake } from '../../../../types';
import { alertStyle, magnitudeStyle } from '../../../../components/dashboard/colors';
import { countryOf, fmtDate } from '../../../../components/dashboard/data';

interface AlertMatchesProps {
  matches: Earthquake[];
  onOpen: (event: Earthquake) => void;
  highlightedEventId?: string | null;
}

export default function AlertMatches({ matches, onOpen, highlightedEventId }: AlertMatchesProps) {
  if (!matches.length) {
    return (
      <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.04] p-8 text-center text-sm font-semibold text-slate-400">
        No records currently match your rules.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {matches.map((event) => (
        <article key={event.id} onClick={() => onOpen(event)} className={`cursor-pointer rounded-2xl border bg-white/[0.06] p-4 shadow-xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200/30 ${event.id === highlightedEventId ? 'border-cyan-300 shadow-cyan-500/20' : 'border-white/10'}`}>
          <div className="flex items-start justify-between gap-3">
            <span className={`rounded-2xl border px-3 py-1.5 text-sm font-black ${magnitudeStyle(event.magnitude)}`}>M {event.magnitude.toFixed(1)}</span>
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase ${alertStyle(event.alert)}`}>{event.alert ?? 'No alert'}</span>
          </div>
          <h4 className="mt-3 truncate text-base font-black text-white" title={event.place}>{event.place}</h4>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-400"><MapPin className="h-3 w-3 text-cyan-300" /> {countryOf(event.place)}</p>
          <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5 text-orange-300" /> {event.depth.toFixed(1)} km</span>
            <span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5 text-cyan-300" /> {fmtDate(event.time, 'UTC')}</span>
          </div>
        </article>
      ))}
    </div>
  );
}


