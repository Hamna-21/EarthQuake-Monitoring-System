import type { Earthquake } from '@/types';
import { Download } from 'lucide-react';
import EmptyState from '@/features/dashboard/components/EmptyState';
import AppButton from '@/features/dashboard/components/common/AppButton';
import { buildEarthquakeCsv, downloadCsv } from '@/features/dashboard/utils/exportCsv';
import { formatAlert, formatDepth, formatMagnitude, formatPlace, formatTsunami, formatUtcTime } from '@/features/dashboard/historical/utils/historyDisplay';

const headers = ['Date & Time', 'Magnitude', 'Location', 'Depth', 'Alert', 'Tsunami', 'Details'];

/** Renders the same filtered historical events as the map and exposes row selection/export actions. */
export default function HistoricalResultsTable({ events, loading, onSelect, csvFilename = 'geopulse-earthquakes-filtered-results.csv' }: { events: Earthquake[]; loading: boolean; onSelect: (event: Earthquake) => void; csvFilename?: string; }) {
  if (loading && !events.length) return <LoadingTable />;
  return (
    <section className="historical-results">
      <TableTitle events={events} csvFilename={csvFilename} />
      <div className="historical-results__scroll scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-600">
        <table className="historical-results__table">
          <thead className="historical-results__head">
            <tr>{headers.map((header) => <th key={header} className={`historical-results__cell ${widthFor(header)}`}>{header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {events.map((event) => <EventRow key={event.id} event={event} onSelect={onSelect} />)}
          </tbody>
        </table>
      </div>
      {!events.length && <div className="historical-results__empty"><EmptyState title="No Records Found" text="Try a different date range, magnitude, or location search." /></div>}
    </section>
  );
}

/** Renders or coordinates table title for this frontend module. */
function TableTitle({ events, csvFilename }: { events: Earthquake[]; csvFilename: string }) {
  return (
    <div className="historical-results__title">
      <div><p className="font-serif text-[10px] font-black uppercase tracking-[0.22em] text-white/80">Live Seismic Log</p><h2 className="mt-1 font-serif text-xl font-black text-white">Earthquake Records</h2><p className="mt-1 text-sm font-semibold text-white/85">Clean historical results with readable risk badges.</p></div>
      <AppButton variant="primary" size="sm" icon={<Download className="h-3.5 w-3.5" />} disabled={!events.length} onClick={() => downloadCsv(csvFilename, buildEarthquakeCsv(events))} className="rounded-xl bg-slate-950/75 px-3 py-2 text-xs font-black text-white shadow-lg transition hover:bg-slate-950"></AppButton>
    </div>
  );
}

/** Renders or coordinates event row for this frontend module. */
function EventRow({ event, onSelect }: { event: Earthquake; onSelect: (event: Earthquake) => void; }) {
  return (
    <tr onClick={() => onSelect(event)} className={`cursor-pointer transition hover:bg-cyan-400/10 ${rowTone(event.magnitude)}`}>
      <td className="historical-results__time">{formatUtcTime(event.time)}</td>
      <td className="historical-results__text"><MagBadge mag={event.magnitude} /></td>
      <td className="historical-results__place">{formatPlace(event.place)}</td>
      <td className="historical-results__text"><DepthBadge depth={event.depth} /></td>
      <td className="historical-results__text"><AlertBadge alert={event.alert} /></td>
      <td className="historical-results__text"><TsunamiBadge event={event} /></td>
      <td className="historical-results__text"><DetailsButton event={event} onSelect={onSelect} /></td>
    </tr>
  );
}

/** Renders or coordinates loading table for this frontend module. */
function LoadingTable() {
  return <div className="historical-results__loading"><p className="font-serif text-lg font-black text-white">Loading earthquake records...</p><div className="mt-4 space-y-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="history-loading__row" />)}</div></div>;
}

/** Renders or coordinates row tone for this frontend module. */
function rowTone(mag: number) {
  if (mag >= 6) return 'historical-results__row--strong';
  if (mag >= 5) return 'historical-results__row--elevated';
  return 'historical-results__row--normal';
}

/** Renders or coordinates width for for this frontend module. */
function widthFor(header: string) {
  return header === 'Location' ? 'w-[30%]' : header === 'Date & Time' ? 'w-[18%]' : header === 'Magnitude' ? 'w-[13%]' : 'w-[9.75%]';
}

/** Renders or coordinates mag badge for this frontend module. */
function MagBadge({ mag }: { mag: number }) {
  const tone = mag >= 6 ? 'historical-results__magnitude--strong' : mag >= 5 ? 'historical-results__magnitude--elevated' : 'historical-results__magnitude--normal';
  return <span className={`historical-results__magnitude ${tone}`}>{formatMagnitude(mag)} <span className="ml-1 text-[10px]">MAG</span></span>;
}

/** Renders or coordinates depth badge for this frontend module. */
function DepthBadge({ depth }: { depth: number }) {
  const tone = depth >= 300 ? 'bg-fuchsia-300/12 text-fuchsia-100 ring-fuchsia-200/25' : depth >= 70 ? 'bg-violet-300/12 text-violet-100 ring-violet-200/25' : 'bg-emerald-300/12 text-emerald-100 ring-emerald-200/25';
  return <span className={`historical-results__badge historical-results__depth ${tone}`}>{formatDepth(depth)}</span>;
}

/** Renders or coordinates alert badge for this frontend module. */
function AlertBadge({ alert }: { alert: Earthquake['alert'] }) {
  const tone = alert === 'red' ? 'bg-red-300/15 text-red-100 ring-red-200/25' : alert ? 'bg-amber-300/12 text-amber-100 ring-amber-200/25' : 'bg-slate-300/10 text-slate-200 ring-white/15';
  return <span className={`historical-results__badge ${tone}`}>{formatAlert(alert)}</span>;
}

/** Renders or coordinates tsunami badge for this frontend module. */
function TsunamiBadge({ event }: { event: Earthquake }) {
  const label = formatTsunami(event);
  const tone = label === 'Yes' ? 'bg-fuchsia-300/15 text-fuchsia-100 ring-fuchsia-200/25' : 'bg-slate-300/10 text-slate-200 ring-white/15';
  return <span className={`historical-results__badge ${tone}`}>{label}</span>;
}

/** Renders or coordinates details button for this frontend module. */
function DetailsButton({ event, onSelect }: { event: Earthquake; onSelect: (event: Earthquake) => void; }) {
  return <button onClick={(click) => { click.stopPropagation(); onSelect(event); }} className="historical-results__details-button">Details</button>;
}
