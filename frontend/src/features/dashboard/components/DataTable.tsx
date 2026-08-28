import { Radio } from 'lucide-react';
import { Earthquake } from '@/types';
import DataTableHeader from '@/features/dashboard/components/DataTableHeader';
import DataTableRow from '@/features/dashboard/components/DataTableRow';
import EmptyState from '@/features/dashboard/components/EmptyState';

/** Renders or coordinates data table for this frontend module. */
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
    <div className="dashboard-data-table">
      <div className="dashboard-data-table__header">
        <div className="dashboard-data-table__header-glow" />
        <p className="dashboard-data-table__eyebrow">
          <Radio className="h-3.5 w-3.5" /> Live Seismic Log
        </p>
        <h2 className="dashboard-data-table__title">Earthquake Records</h2>
        <p className="dashboard-data-table__subtitle">Sortable records with color-coded risk factors.</p>
      </div>
      <div className="dashboard-data-table__scroll">
        <table className="dashboard-data-table__body">
          <colgroup>
            <col className="dashboard-data-col--magnitude" /><col className="dashboard-data-col--place" />
            <col className="dashboard-data-col--depth" /><col className="dashboard-data-col--time" />
            <col className="dashboard-data-col--country" /><col className="dashboard-data-col--status" />
            <col className="dashboard-data-col--actions" /><col className="dashboard-data-col--source" />
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
        <div className="dashboard-data-table__empty">
          <EmptyState title="No Historical Records" text="No earthquake records were found for the selected filters." />
        </div>
      )}
    </div>
  );
}


/** Renders the reusable table shell for earthquake records and results. */
