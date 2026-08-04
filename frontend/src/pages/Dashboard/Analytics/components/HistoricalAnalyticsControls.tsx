import { cloneElement, type FormEvent, type ReactElement } from 'react';
import type { AnalyticsFilters } from '../analyticsTypes';

type Props = {
  draft: AnalyticsFilters;
  setDraft: (patch: Partial<AnalyticsFilters>) => void;
  onApply: () => void;
  onReset: () => void;
  onRefresh: () => void;
  isLoading: boolean;
};

const numberOrNull = (value: string) => value === '' ? null : Number(value);

export default function HistoricalAnalyticsControls({ draft, setDraft, onApply, onReset, onRefresh, isLoading }: Props) {
  const submit = (event: FormEvent) => { event.preventDefault(); onApply(); };
  return (
    <form onSubmit={submit} className="mb-5 rounded-2xl border border-orange-300/10 bg-slate-950/60 p-3 shadow-xl shadow-cyan-950/20 backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-sans text-[11px] font-black uppercase tracking-[0.18em] text-orange-100">Historical filters</p>
        <span className="hidden rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 font-sans text-[10px] font-bold text-slate-300 sm:inline">Pakistan · Mag 4+</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-[repeat(6,minmax(0,1fr))_auto]">
        <Field label="Start"><input type="date" value={draft.startDate} onChange={(e) => setDraft({ startDate: e.target.value })} /></Field>
        <Field label="End"><input type="date" value={draft.endDate} onChange={(e) => setDraft({ endDate: e.target.value })} /></Field>
        <Field label="Min Mag"><input type="number" step="0.1" value={draft.minMagnitude} onChange={(e) => setDraft({ minMagnitude: Number(e.target.value) })} /></Field>
        <Field label="Max Mag"><input type="number" step="0.1" value={draft.maxMagnitude ?? ''} onChange={(e) => setDraft({ maxMagnitude: numberOrNull(e.target.value) })} /></Field>
        <Field label="Min Depth"><input type="number" step="1" value={draft.minDepth ?? ''} onChange={(e) => setDraft({ minDepth: numberOrNull(e.target.value) })} /></Field>
        <Field label="Max Depth"><input type="number" step="1" value={draft.maxDepth ?? ''} onChange={(e) => setDraft({ maxDepth: numberOrNull(e.target.value) })} /></Field>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-3 2xl:col-span-1 2xl:items-end">
          <button className="h-9 min-w-24 flex-1 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 px-3 font-sans text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-orange-950/30" disabled={isLoading}>Apply</button>
          <button type="button" onClick={onReset} className="h-9 rounded-xl border border-white/10 bg-white/10 px-3 font-sans text-[11px] font-black text-white">Reset</button>
          <button type="button" onClick={onRefresh} className="h-9 rounded-xl border border-orange-300/20 bg-orange-300/10 px-3 font-sans text-[11px] font-black text-orange-100">Refresh</button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactElement<{ className?: string }> }) {
  return (
    <label className="space-y-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
      <span>{label}</span>
      {cloneElement(children, { className: 'h-9 w-full rounded-xl border border-white/10 bg-slate-950/70 px-2.5 font-sans text-xs font-black text-white outline-none transition focus:border-orange-300/60' })}
    </label>
  );
}
