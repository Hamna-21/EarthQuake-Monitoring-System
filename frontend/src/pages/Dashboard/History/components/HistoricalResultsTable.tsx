import type { Earthquake } from '../../../../types';
import EmptyState from '../../../../components/dashboard/EmptyState';
import { formatAlert, formatDepth, formatMagnitude, formatPlace, formatTsunami, formatUtcTime } from '../historyDisplay';

const headers = ['Date & Time', 'Magnitude', 'Location', 'Depth', 'Alert', 'Tsunami', 'Details'];

export default function HistoricalResultsTable({ events, loading, onSelect }: { events: Earthquake[]; loading: boolean; onSelect: (event: Earthquake) => void; }) {
  if (loading && !events.length) return <LoadingTable />;
  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-300/15 bg-slate-950/75 shadow-2xl shadow-cyan-950/20 backdrop-blur-2xl">
      <TableTitle />
      <div className="max-h-[520px] overflow-auto scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-600">
        <table className="w-full min-w-[1040px] table-fixed text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-900/95 text-[10px] uppercase tracking-[0.14em] text-slate-200 backdrop-blur-xl">
            <tr>{headers.map((header) => <th key={header} className={`px-4 py-3 font-black ${widthFor(header)}`}>{header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {events.map((event) => <EventRow key={event.id} event={event} onSelect={onSelect} />)}
          </tbody>
        </table>
      </div>
      {!events.length && <div className="p-8"><EmptyState title="No Records Found" text="Try a different date range, magnitude, or location search." /></div>}
    </section>
  );
}

function TableTitle() {
  return (
    <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-4">
      <p className="font-serif text-[10px] font-black uppercase tracking-[0.22em] text-white/80">Live Seismic Log</p>
      <h2 className="mt-1 font-serif text-xl font-black text-white">Earthquake Records</h2>
      <p className="mt-1 text-sm font-semibold text-white/85">Clean historical results with readable risk badges.</p>
    </div>
  );
}

function EventRow({ event, onSelect }: { event: Earthquake; onSelect: (event: Earthquake) => void; }) {
  return (
    <tr onClick={() => onSelect(event)} className={`cursor-pointer transition hover:bg-cyan-400/10 ${rowTone(event.magnitude)}`}>
      <td className="px-4 py-3 text-sm font-semibold leading-snug text-slate-300">{formatUtcTime(event.time)}</td>
      <td className="px-4 py-3"><MagBadge mag={event.magnitude} /></td>
      <td className="px-4 py-3 font-serif text-sm font-black leading-snug text-white">{formatPlace(event.place)}</td>
      <td className="px-4 py-3"><DepthBadge depth={event.depth} /></td>
      <td className="px-4 py-3"><AlertBadge alert={event.alert} /></td>
      <td className="px-4 py-3"><TsunamiBadge event={event} /></td>
      <td className="px-4 py-3"><DetailsButton event={event} onSelect={onSelect} /></td>
    </tr>
  );
}

function LoadingTable() {
  return <div className="rounded-2xl border border-cyan-300/15 bg-slate-950/75 p-6 shadow-2xl shadow-cyan-950/20"><p className="font-serif text-lg font-black text-white">Loading earthquake records...</p><div className="mt-4 space-y-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-xl bg-white/10" />)}</div></div>;
}

function rowTone(mag: number) {
  if (mag >= 6) return 'bg-red-500/[0.07]';
  if (mag >= 5) return 'bg-amber-500/[0.07]';
  return 'odd:bg-white/[0.035]';
}

function widthFor(header: string) {
  return header === 'Location' ? 'w-[30%]' : header === 'Date & Time' ? 'w-[18%]' : header === 'Magnitude' ? 'w-[13%]' : 'w-[9.75%]';
}

function MagBadge({ mag }: { mag: number }) {
  const tone = mag >= 6 ? 'bg-red-100 text-red-600 ring-red-300/40' : mag >= 5 ? 'bg-amber-100 text-orange-600 ring-amber-300/40' : 'bg-cyan-100 text-cyan-700 ring-cyan-300/40';
  return <span className={`inline-flex whitespace-nowrap rounded-xl px-3 py-1.5 font-serif text-base font-black shadow-lg ring-1 ${tone}`}>{formatMagnitude(mag)} <span className="ml-1 text-[10px]">MAG</span></span>;
}

function DepthBadge({ depth }: { depth: number }) {
  const tone = depth >= 300 ? 'bg-fuchsia-300/12 text-fuchsia-100 ring-fuchsia-200/25' : depth >= 70 ? 'bg-violet-300/12 text-violet-100 ring-violet-200/25' : 'bg-emerald-300/12 text-emerald-100 ring-emerald-200/25';
  return <span className={`inline-flex min-w-[74px] justify-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${tone}`}>{formatDepth(depth)}</span>;
}

function AlertBadge({ alert }: { alert: Earthquake['alert'] }) {
  const tone = alert === 'red' ? 'bg-red-300/15 text-red-100 ring-red-200/25' : alert ? 'bg-amber-300/12 text-amber-100 ring-amber-200/25' : 'bg-slate-300/10 text-slate-200 ring-white/15';
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${tone}`}>{formatAlert(alert)}</span>;
}

function TsunamiBadge({ event }: { event: Earthquake }) {
  const label = formatTsunami(event);
  const tone = label === 'Yes' ? 'bg-fuchsia-300/15 text-fuchsia-100 ring-fuchsia-200/25' : 'bg-slate-300/10 text-slate-200 ring-white/15';
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${tone}`}>{label}</span>;
}

function DetailsButton({ event, onSelect }: { event: Earthquake; onSelect: (event: Earthquake) => void; }) {
  return <button onClick={(click) => { click.stopPropagation(); onSelect(event); }} className="rounded-xl bg-gradient-to-r from-red-700 via-orange-500 to-amber-400 px-4 py-2 text-xs font-black text-white shadow-md shadow-orange-950/30 transition hover:brightness-110">Details</button>;
}
