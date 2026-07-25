import { CalendarDays, Flame, Globe2, Search, TriangleAlert } from 'lucide-react';

export function HistoryFilters({
  startDate, endDate, minMag, query, loading, error,
  setStartDate, setEndDate, setMinMag, setQuery, onSearch,
}: {
  startDate: string; endDate: string; minMag: number; query: string; loading: boolean; error: string | null;
  setStartDate: (v: string) => void; setEndDate: (v: string) => void; setMinMag: (v: number) => void; setQuery: (v: string) => void; onSearch: () => void;
}) {
  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.07] p-5 shadow-md shadow-black/20 backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-rose-500 to-orange-500" />
        <h2 className="text-base font-black text-white">Search Filters</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        <Field label="Start date" type="date" value={startDate} setValue={setStartDate} icon={<CalendarDays className="h-3.5 w-3.5" />} />
        <Field label="End date" type="date" value={endDate} setValue={setEndDate} icon={<CalendarDays className="h-3.5 w-3.5" />} />
        <Field label="Min magnitude" type="number" value={String(minMag)} setValue={(v) => setMinMag(Number(v))} icon={<Flame className="h-3.5 w-3.5" />} />
        <Field label="Country or region" value={query} setValue={setQuery} icon={<Globe2 className="h-3.5 w-3.5" />} />
        <div className="flex flex-col justify-end">
          <button onClick={onSearch} disabled={loading} className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-rose-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? <><Spinner /> Searching</> : <><Search className="h-4 w-4" /> Search</>}
          </button>
        </div>
      </div>
      {error && <p className="mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-200"><TriangleAlert className="h-4 w-4 flex-shrink-0" /> {error}</p>}
    </section>
  );
}

function Field({ label, value, setValue, type = 'text', icon }: { label: string; value: string; setValue: (v: string) => void; type?: string; icon?: React.ReactNode; }) {
  return <label className="block text-xs font-black uppercase tracking-wide text-slate-300"><span className="mb-1.5 flex items-center gap-1.5">{icon}{label}</span><input type={type} value={value} min={type === 'date' ? '1990-01-01' : undefined} onChange={(e) => setValue(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm font-semibold text-white outline-none transition-colors placeholder:text-slate-500 focus:border-rose-400 focus:bg-black/30" /></label>;
}

function Spinner() {
  return <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>;
}



