import { Download, Search } from 'lucide-react';
import { EventFilters, SortState } from '../../../../components/dashboard/types';

export default function FeedFilters({ filters, sort, onFilter, onSort, onExport, disabled }: { filters: EventFilters; sort: SortState; onFilter: (patch: Partial<EventFilters>) => void; onSort: (sort: SortState) => void; onExport: () => void; disabled: boolean; }) {
  return (
    <section className="rounded-2xl border border-white/12 bg-white/[0.07] p-5 shadow-sm backdrop-blur">
      <div className="grid items-end gap-4 lg:grid-cols-[1fr_170px_160px_150px_130px]">
        <Field label="Search"><label className="relative"><Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" /><input value={filters.query} onChange={(e) => onFilter({ query: e.target.value })} placeholder="Search country, city, ID" className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-red-500" /></label></Field>
        <Field label="Alert"><Select value={filters.alert} onChange={(value) => onFilter({ alert: value })} options={['all', 'green', 'yellow', 'orange', 'red', 'none']} /></Field>
        <Field label="Tsunami"><Select value={filters.tsunami} onChange={(value) => onFilter({ tsunami: value })} options={['all', 'yes', 'no']} /></Field>
        <Field label="Sort By"><Select value={sort.key} onChange={(value) => onSort({ ...sort, key: value as SortState['key'] })} options={['time', 'magnitude', 'depth', 'place']} /></Field>
        <Field label="Export"><button onClick={onExport} disabled={disabled} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-40"><Download className="h-4 w-4" />CSV</button></Field>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-col"><label className="mb-2 h-5 text-xs font-semibold text-slate-200">{label}</label>{children}</div>;
}
function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold capitalize text-white">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select>;
}



