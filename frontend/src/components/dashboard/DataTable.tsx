import React from 'react';
import { Clock3, Flame, Globe2, MapPin, Radio, Ruler, Waves } from 'lucide-react';
import { Earthquake } from '../../types';
import { alertStyle, depthStyle, magnitudeStyle } from './colors';
import { countryOf, fmtDate } from './data';
import Badge from './Badge';
import EmptyState from './EmptyState';

function tierAccent(magnitude: number) {
  if (magnitude >= 6) return { text: 'text-rose-600', border: 'border-l-rose-500', chip: 'bg-rose-50 text-rose-600' };
  if (magnitude >= 5) return { text: 'text-amber-600', border: 'border-l-amber-400', chip: 'bg-amber-50 text-amber-600' };
  if (magnitude >= 3) return { text: 'text-cyan-600', border: 'border-l-cyan-400', chip: 'bg-cyan-50 text-cyan-600' };
  return { text: 'text-emerald-600', border: 'border-l-emerald-400', chip: 'bg-emerald-50 text-emerald-600' };
}

const STATUS_PALETTE = [
  'bg-violet-50 text-violet-700 ring-violet-200',
  'bg-cyan-50 text-cyan-700 ring-cyan-200',
  'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'bg-amber-50 text-amber-700 ring-amber-200',
  'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
];
function statusTone(status: string) {
  let hash = 0;
  for (let i = 0; i < status.length; i++) hash = (hash * 31 + status.charCodeAt(i)) >>> 0;
  return STATUS_PALETTE[hash % STATUS_PALETTE.length];
}

const COLUMNS = [
  { key: 'mag', head: 'Magnitude', icon: Flame, tone: 'text-rose-400' },
  { key: 'loc', head: 'Location', icon: MapPin, tone: 'text-cyan-400' },
  { key: 'country', head: 'Country', icon: Globe2, tone: 'text-emerald-400' },
  { key: 'depth', head: 'Depth', icon: Ruler, tone: 'text-violet-400' },
  { key: 'time', head: 'Time (UTC)', icon: Clock3, tone: 'text-amber-400' },
  { key: 'alert', head: 'Alert', icon: Radio, tone: 'text-orange-400' },
  { key: 'tsunami', head: 'Tsunami', icon: Waves, tone: 'text-blue-400' },
  { key: 'status', head: 'Status', icon: Radio, tone: 'text-fuchsia-400' },
] as const;

export default function DataTable({
  events,
  onSelect,
}: {
  events: Earthquake[];
  onSelect: (event: Earthquake) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/70 bg-white/90 shadow-xl backdrop-blur">
      <div className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 px-6 py-5 sm:px-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-32 w-32 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <p className="relative flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100">
          <Radio className="h-3.5 w-3.5" /> Live Seismic Log
        </p>
        <h2 className="relative mt-1.5 font-serif text-2xl font-black italic tracking-tight text-white">Earthquake Records</h2>
        <p className="relative mt-1 text-sm font-medium text-cyan-50">Sortable, source-ready records with color-coded risk factors.</p>
      </div>

      <div className="max-h-[650px] overflow-auto">
        <table className="min-w-full  text-left">
         <colgroup>
  <col style={{ width: "120px" }} />
  <col style={{ width: "420px" }} />
  <col style={{ width: "170px" }} />
  <col style={{ width: "140px" }} />
  <col style={{ width: "220px" }} />
  <col style={{ width: "140px" }} />
  <col style={{ width: "120px" }} />
  <col style={{ width: "150px" }} />
</colgroup>
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-cyan-50 via-blue-50 to-violet-50 shadow-sm">
            <tr className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
              {COLUMNS.map(({ key, head, icon: Icon, tone }) => (
                <th key={key} className="whitespace-nowrap px-6 py-4">
                  <span className="flex items-center gap-1.5">
                    <Icon className={`h-3.5 w-3.5 ${tone}`} />
                    {head}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {events.map((event, index) => {
              const accent = tierAccent(event.magnitude);
              return (
                <tr
                  key={event.id}
                  onClick={() => onSelect(event)}
                  className={`cursor-pointer transition hover:bg-gradient-to-r hover:from-cyan-50/60 hover:to-violet-50/60 ${
                    index % 2 ? 'bg-slate-50/60' : 'bg-white'
                  }`}
                >
                  <td className={`border-l-4 px-6 py-4 ${accent.border}`}>
                    <span className={`inline-flex items-baseline gap-1 rounded-lg px-2 py-1 ${accent.chip}`}>
                      <span className={`font-serif text-xl font-black italic ${accent.text}`}>
                        {event.magnitude.toFixed(1)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">mag</span>
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="truncate font-bold text-slate-900">{event.place}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                      {countryOf(event.place)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <Badge className={depthStyle(event.depth)}>{event.depth.toFixed(1)} km</Badge>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-semibold text-violet-600">{fmtDate(event.time, 'UTC')}</span>
                  </td>

                  <td className="px-6 py-4">
                    <Badge className={alertStyle(event.alert)}>{event.alert ?? 'None'}</Badge>
                  </td>

                  <td className="px-6 py-4">
                    <Badge
                      className={
                        event.tsunami
                          ? 'border-fuchsia-600 bg-fuchsia-100 text-fuchsia-800'
                          : 'border-teal-600 bg-teal-100 text-teal-800'
                      }
                    >
                      {event.tsunami ? 'Yes' : 'No'}
                    </Badge>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusTone(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!events.length && (
        <div className="p-10">
          <EmptyState title="No Historical Records" text="No earthquake records were found for the selected filters." />
        </div>
      )}
    </div>
  );
}