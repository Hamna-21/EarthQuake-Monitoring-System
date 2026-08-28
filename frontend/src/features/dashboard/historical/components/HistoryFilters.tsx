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

/** Keeps historical date, magnitude, and location controls controlled by the parent search hook. */
export function HistoryFilters(props: Props) {
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!props.loading) props.onSearch();
  };

  return (
    <section className="history-filters">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-500/[0.04] via-transparent to-orange-500/[0.05]" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange-500/[0.07] blur-3xl" />
      <form onSubmit={submit} className="history-filters__form">
        <div className="history-filters__heading">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 shadow-md shadow-orange-500/40" />
          <h2 className="font-serif text-lg font-black text-white">Search Filters</h2>
        </div>
        <div className="history-filters__grid">
          <Field label="Start Date" type="date" value={props.startDate} min="1975-01-01" icon={<CalendarDays className="h-3.5 w-3.5" />} onChange={props.onStartDateChange} />
          <Field label="End Date" type="date" value={props.endDate} min="1975-01-01" icon={<CalendarDays className="h-3.5 w-3.5" />} onChange={props.onEndDateChange} />
          <Field label="Min Magnitude" type="number" value={String(props.minMag)} min="0" max="10" step="0.1" icon={<Flame className="h-3.5 w-3.5" />} onChange={(value) => props.onMinMagChange(Number.isNaN(Number(value)) ? 0 : Number(value))} />
          <Field label={props.locationLabel ?? 'Country or Region'} value={props.query} placeholder="Pakistan" locked={props.locationLocked} icon={<Globe2 className="h-3.5 w-3.5" />} onChange={props.onQueryChange} />
          <button type="submit" disabled={props.loading} className="history-filter-button">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
            <span className="pointer-events-none absolute -left-16 top-0 h-full w-12 -skew-x-12 bg-white/20 blur-sm transition-all duration-700 group-hover:left-[120%]" />
            <span className="relative flex items-center justify-center gap-2">{props.loading ? <><Spinner /><span>Searching</span></> : <><Search className="h-4 w-4" /><span>Search</span></>}</span>
          </button>
          <button type="button" onClick={props.onReset} disabled={props.loading} className="history-reset-button">
            Reset
          </button>
        </div>
        {props.error && <div role="alert" className="history-filter-error"><TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{props.error}</span></div>}
      </form>
    </section>
  );
}

type FieldProps = { label: string; value: string; type?: 'text' | 'date' | 'number'; placeholder?: string; min?: string; max?: string; step?: string; icon?: ReactNode; locked?: boolean; onChange: (value: string) => void; };

/** Renders or coordinates field for this frontend module. */
function Field({ label, value, type = 'text', placeholder, min, max, step, icon, locked, onChange }: FieldProps) {
  return (
    <label className="history-field">
      <span className="history-field__label">{icon}<span>{label}</span></span>
      <input type={type} value={value} placeholder={placeholder} min={min} max={max} step={step} readOnly={locked} onChange={(event) => onChange(event.target.value)} className="history-field__input" />
    </label>
  );
}

/** Renders or coordinates spinner for this frontend module. */
function Spinner() {
  return <span className="relative flex h-4 w-4 items-center justify-center"><span className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /><span className="h-1.5 w-1.5 rounded-full bg-white/80" /></span>;
}
