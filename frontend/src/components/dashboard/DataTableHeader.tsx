import { tableColumns } from './tableConfig';

export default function DataTableHeader() {
  return (
    <thead className="sticky top-0 z-10 bg-gradient-to-r from-cyan-50 via-blue-50 to-violet-50 shadow-sm">
      <tr className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
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
