import { Radio } from 'lucide-react';
import { Earthquake } from '../../types';
import DataTableHeader from './DataTableHeader';
import DataTableRow from './DataTableRow';
import EmptyState from './EmptyState';

export default function DataTable({
  events,
  onSelect,
  highlightedEventId,
}: {
  events: Earthquake[];
  onSelect: (event: Earthquake) => void;
  highlightedEventId?: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-2xl">
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 px-6 py-5 sm:px-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <p className="relative flex items-center gap-2 font-serif text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100">
          <Radio className="h-3.5 w-3.5" /> Live Seismic Log
        </p>
        <h2 className="relative mt-1.5 text-2xl font-black tracking-tight text-white">Earthquake Records</h2>
        <p className="relative mt-1 text-sm font-medium text-cyan-50">Sortable records with color-coded risk factors.</p>
      </div>
      <div className="max-h-[650px] overflow-auto">
        <table className="min-w-full text-left">
          <colgroup>
            <col style={{ width: '120px' }} /><col style={{ width: '420px' }} />
            <col style={{ width: '170px' }} /><col style={{ width: '140px' }} />
            <col style={{ width: '220px' }} /><col style={{ width: '140px' }} />
            <col style={{ width: '120px' }} /><col style={{ width: '150px' }} />
          </colgroup>
          <DataTableHeader />
          <tbody className="divide-y divide-slate-100">
            {events.map((event, index) => (
              <DataTableRow key={event.id} event={event} index={index} onSelect={onSelect} highlighted={event.id === highlightedEventId} />
            ))}
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


