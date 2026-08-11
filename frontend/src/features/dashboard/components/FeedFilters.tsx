import { Download, Search } from 'lucide-react';
import { EventFilters, SortState } from '@/features/dashboard/types';

const inputCls = 'w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none transition focus:border-cyan-400';

export default function FeedFilters({ filters, sort, onFilter, onSort, onExport, disabled }: { filters: EventFilters; sort: SortState; onFilter: (patch: Partial<EventFilters>) => void; onSort: (sort: SortState) => void; onExport: () => void; disabled: boolean }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.06] p-3 backdrop-blur">
      <div className="grid items-end gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_130px_120px_130px_100px]">
        <Field label="Search">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input value={filters.query} onChange={(e) => onFilter({ query: e.target.value })} placeholder="Search location" className={`${inputCls} pl-9`} />
          </div>
        </Field>
        <Field label="Alert"><Select value={filters.alert} onChange={(v) => onFilter({ alert: v })} options={['all', 'green', 'yellow', 'orange', 'red', 'none']} /></Field>
        <Field label="Tsunami"><Select value={filters.tsunami} onChange={(v) => onFilter({ tsunami: v })} options={['all', 'yes', 'no']} /></Field>
        <Field label="Sort By"><Select value={sort.key} onChange={(v) => onSort({ ...sort, key: v as SortState['key'] })} options={['time', 'magnitude', 'depth', 'place']} /></Field>
        <Field label="Export">
          <button onClick={onExport} disabled={disabled} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-40">
            <Download className="h-3.5 w-3.5" />CSV
          </button>
        </Field>
      </div>
    </section>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex min-w-0 flex-col">
    <label className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</label>
    {children}
  </div>
);

const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} font-bold capitalize`}>
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);