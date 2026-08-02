import type { ReactNode } from 'react';
import { CalendarDays, Flame, Globe2, Search, TriangleAlert } from 'lucide-react';

type Props = {
  startDate: string;
  endDate: string;
  minMag: number;
  query: string;
  loading: boolean;
  error: string | null;
  locationLabel?: string;
  locationLocked?: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onMinMagChange: (value: number) => void;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
};

export function HistoryFilters(props: Props) {
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!props.loading) props.onSearch();
  };

  return (
    <section className="relative mb-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-500/[0.04] via-transparent to-orange-500/[0.05]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange-500/[0.07] blur-3xl" />
      <form onSubmit={submit} className="relative">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 shadow-md shadow-orange-500/40" />
          <h2 className="font-serif text-lg font-black text-white">Search Filters</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_0.85fr_1.1fr_145px_92px] xl:items-end">
          <Field label="Start Date" type="date" value={props.startDate} min="1975-01-01" icon={<CalendarDays className="h-3.5 w-3.5" />} onChange={props.onStartDateChange} />
          <Field label="End Date" type="date" value={props.endDate} min="1975-01-01" icon={<CalendarDays className="h-3.5 w-3.5" />} onChange={props.onEndDateChange} />
          <Field label="Min Magnitude" type="number" value={String(props.minMag)} min="0" max="10" step="0.1" icon={<Flame className="h-3.5 w-3.5" />} onChange={(value) => props.onMinMagChange(Number.isNaN(Number(value)) ? 0 : Number(value))} />
          <Field label={props.locationLabel ?? 'Country or Region'} value={props.query} placeholder="Pakistan" locked={props.locationLocked} icon={<Globe2 className="h-3.5 w-3.5" />} onChange={props.onQueryChange} />
          <button type="submit" disabled={props.loading} className="group relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 px-4 font-serif text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-red-950/35 ring-1 ring-orange-200/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-orange-300/60 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:brightness-100 sm:col-span-2 xl:col-span-1">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
            <span className="pointer-events-none absolute -left-16 top-0 h-full w-12 -skew-x-12 bg-white/20 blur-sm transition-all duration-700 group-hover:left-[120%]" />
            <span className="relative flex items-center justify-center gap-2">{props.loading ? <><Spinner /><span>Searching</span></> : <><Search className="h-4 w-4" /><span>Search</span></>}</span>
          </button>
          <button type="button" onClick={props.onReset} disabled={props.loading} className="h-10 rounded-xl border border-white/10 bg-white/10 px-3 font-serif text-xs font-black uppercase tracking-wide text-slate-100 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-orange-300/40 disabled:opacity-60 sm:col-span-2 xl:col-span-1">
            Reset
          </button>
        </div>
        {props.error && <div role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-rose-300/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100"><TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{props.error}</span></div>}
      </form>
    </section>
  );
}

type FieldProps = { label: string; value: string; type?: 'text' | 'date' | 'number'; placeholder?: string; min?: string; max?: string; step?: string; icon?: ReactNode; locked?: boolean; onChange: (value: string) => void; };

function Field({ label, value, type = 'text', placeholder, min, max, step, icon, locked, onChange }: FieldProps) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 flex items-center gap-1.5 font-serif text-[11px] font-black uppercase tracking-wide text-slate-300">{icon}<span>{label}</span></span>
      <input type={type} value={value} placeholder={placeholder} min={min} max={max} step={step} readOnly={locked} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-xl border border-white/10 bg-slate-950/35 px-3 font-serif text-sm font-bold text-white outline-none transition-all duration-200 placeholder:font-semibold placeholder:text-slate-500 hover:border-white/20 focus:border-orange-400/70 focus:bg-slate-950/55 focus:ring-2 focus:ring-orange-500/10 read-only:cursor-not-allowed read-only:text-orange-100" />
    </label>
  );
}

function Spinner() {
  return <span className="relative flex h-4 w-4 items-center justify-center"><span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /><span className="h-1.5 w-1.5 rounded-full bg-white/80" /></span>;
}
