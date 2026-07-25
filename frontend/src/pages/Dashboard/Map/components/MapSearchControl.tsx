import { Loader2, LocateFixed, MapPin, Search, X } from 'lucide-react';

export function MapSearchControl(props: {
  query: string; onQuery: (value: string) => void; onSearchSubmit: () => void; onLocateMe: () => void;
  isSearching: boolean; isLocating: boolean; hasSearchPin: boolean; onClearSearchPin: () => void;
  searchError: string | null; locateError: string | null;
}) {
  return (
    <Section label="Find a location" icon={<Search className="h-3.5 w-3.5 text-cyan-400" />} tint="from-cyan-500/10 to-fuchsia-500/10" border="border-cyan-400/20" className="xl:col-span-2">
      <div className="flex gap-2">
        <label className="relative block flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
          <input value={props.query} onChange={(e) => props.onQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') props.onSearchSubmit(); }} placeholder="Search a place..." className="w-full rounded-2xl border border-cyan-400/20 bg-slate-950/60 py-2.5 pl-10 pr-8 text-sm text-white outline-none placeholder:text-slate-500 transition-colors focus:border-cyan-400 focus:bg-slate-950/90" />
          {props.hasSearchPin && <button onClick={props.onClearSearchPin} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-rose-400" title="Clear search pin"><X className="h-4 w-4" /></button>}
        </label>
        <button onClick={props.onSearchSubmit} disabled={props.isSearching || !props.query.trim()} className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-fuchsia-900/30 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100" title="Fly to place">{props.isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}</button>
        <button onClick={props.onLocateMe} disabled={props.isLocating} className="flex flex-shrink-0 items-center gap-1.5 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 text-xs font-bold text-cyan-200 transition-colors hover:from-cyan-500/30 hover:to-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50">{props.isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}</button>
      </div>
      {props.searchError && <InlineError>{props.searchError}</InlineError>}
      {props.locateError && <InlineError>{props.locateError}</InlineError>}
      {props.hasSearchPin && <div className="mt-2 flex items-center gap-1.5 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-2.5 py-1.5 text-[11px] font-bold text-fuchsia-200"><MapPin className="h-3 w-3 flex-shrink-0" /> Search pin active</div>}
    </Section>
  );
}

function Section({ label, icon, trailing, tint, border, className, children }: { label?: string; icon?: React.ReactNode; trailing?: React.ReactNode; tint?: string; border?: string; className?: string; children: React.ReactNode; }) {
  return <div className={`rounded-2xl border ${border ?? 'border-white/10'} bg-gradient-to-br ${tint ?? 'from-white/5 to-white/0'} p-3 ${className ?? ''}`}>{label && <div className="mb-2 flex items-center justify-between"><span className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-slate-300">{icon}{label}</span>{trailing}</div>}{children}</div>;
}
function InlineError({ children }: { children: React.ReactNode }) { return <p className="mt-1.5 text-[11px] font-bold text-rose-400">{children}</p>; }


