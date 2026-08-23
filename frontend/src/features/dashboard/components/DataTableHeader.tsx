import { tableColumns } from '@/features/dashboard/constants';

/** Renders or coordinates data table header for this frontend module. */
export default function DataTableHeader() {
  return (
    <thead className="sticky top-0 z-10 bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-red-500/10 shadow-sm backdrop-blur">
      <tr className="text-[11px] font-black uppercase tracking-[0.14em] text-cyan-100">
        {tableColumns.map(({ key, head, icon: Icon, tone }) => (
          <th key={key} className="whitespace-nowrap px-6 py-4">
            <span className="flex items-center gap-1.5">
              <Icon className={`h-3.5 w-3.5 ${tone}`} />
              {head}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
}
/** Renders the column headings for the reusable earthquake data table. */
