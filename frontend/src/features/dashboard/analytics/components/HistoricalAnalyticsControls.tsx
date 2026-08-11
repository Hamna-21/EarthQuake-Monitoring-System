import { cloneElement, type FormEvent, type ReactElement } from 'react';
import type { AnalyticsFilters } from '@/features/dashboard/analytics/types';

type Props = { draft: AnalyticsFilters; setDraft: (patch: Partial<AnalyticsFilters>) => void; onApply: () => void; onReset: () => void; isLoading: boolean; showLocation: boolean };
const years = Array.from({ length: new Date().getUTCFullYear() - 1975 + 1 }, (_, index) => new Date().getUTCFullYear() - index);
const currentYear = String(new Date().getUTCFullYear());
const endDate = (year: string) => year === currentYear ? new Date().toISOString().slice(0, 10) : `${year}-12-31`;

export default function HistoricalAnalyticsControls({ draft, setDraft, onApply, onReset, isLoading, showLocation }: Props) {
  const startYear = draft.startDate.slice(0, 4), endYear = draft.endDate.slice(0, 4);
  const setStart = (year: string) => setDraft({ startDate: `${year}-01-01` });
  const setEnd = (year: string) => setDraft({ endDate: endDate(year) });
  return <form onSubmit={(event: FormEvent) => { event.preventDefault(); onApply(); }} className="rounded-2xl border border-orange-300/10 bg-white/[0.07] p-3 shadow-sm backdrop-blur">
    <div className="mb-2 flex items-center justify-between gap-3"><p className="font-serif text-[11px] font-black uppercase tracking-[0.18em] text-orange-100">Historical filters</p><span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-slate-300">M{draft.minMagnitude}+ selected</span></div>
    <div className={`grid gap-2 sm:grid-cols-2 ${showLocation ? 'lg:grid-cols-[150px_150px_180px_minmax(0,1fr)_auto]' : 'lg:grid-cols-[150px_150px_180px_auto]'}`}>
      <Field label="Start Year"><select value={startYear} onChange={(event) => setStart(event.target.value)}>{years.map((year) => <option key={year}>{year}</option>)}</select></Field>
      <Field label="End Year"><select value={endYear} onChange={(event) => setEnd(event.target.value)}>{years.map((year) => <option key={year}>{year}</option>)}</select></Field>
      <Field label="Minimum Magnitude"><input type="number" min="0" max="10" step="0.1" value={draft.minMagnitude} onChange={(event) => setDraft({ minMagnitude: Number(event.target.value) })} /></Field>
      {showLocation && <Field label="Location"><input value={draft.location} placeholder="Country, city, or region" onChange={(event) => setDraft({ location: event.target.value })} /></Field>}
      <div className="flex gap-2 sm:items-end"><button disabled={isLoading} className="h-9 flex-1 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 px-4 text-[11px] font-black uppercase tracking-wider text-white disabled:opacity-50">Search</button><button type="button" onClick={onReset} className="h-9 rounded-xl border border-white/10 bg-white/10 px-3 text-[11px] font-black text-white">Reset</button></div>
    </div>
  </form>;
}

function Field({ label, children }: { label: string; children: ReactElement<{ className?: string }> }) {
  return <label className="space-y-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400"><span>{label}</span>{cloneElement(children, { className: 'h-9 w-full rounded-xl border border-white/10 bg-slate-950/70 px-2.5 text-xs font-black text-white outline-none focus:border-orange-300/60' })}</label>;
}
