import { Layers, MapPin } from 'lucide-react';
import { Earthquake } from '@/types';
import { magnitudeStyle } from '@/features/dashboard/utils/colors';
import { countryOf } from '@/features/dashboard/utils/data';

interface AlertMatchesProps {
  matches: Earthquake[];
  onOpen: (event: Earthquake) => void;
  highlightedEventId?: string | null;
}

export default function AlertMatches({ matches, onOpen, highlightedEventId }: AlertMatchesProps) {
  if (!matches.length) {
    return (
      <p className="rounded-lg border border-dashed border-white/10 bg-white/[0.04] p-2.5 text-center text-[11px] font-semibold text-slate-400">
        No records currently match your rules.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {matches.map((event) => (
        <article
          key={event.id}
          onClick={() => onOpen(event)}
          title={event.place}
          className={`aspect-square w-full max-w-[110px] cursor-pointer flex flex-col justify-between rounded-lg border bg-white/[0.05] p-2 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-cyan-200/30 ${
            event.id === highlightedEventId ? 'border-cyan-300 shadow-cyan-500/20' : 'border-white/10'
          }`}
        >
          <span className={`self-start rounded-md border px-1.5 py-0.5 text-xs font-black ${magnitudeStyle(event.magnitude)}`}>
            M{event.magnitude.toFixed(1)}
          </span>
          <h4 className="line-clamp-2 text-[11px] font-black leading-tight text-white">{event.place}</h4>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5 text-cyan-300" />{countryOf(event.place)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}