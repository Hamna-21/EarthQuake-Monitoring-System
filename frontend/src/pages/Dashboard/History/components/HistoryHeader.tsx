import { History } from 'lucide-react';

export default function HistoryHeader() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-rose-500/20 bg-slate-950 px-6 py-6 shadow-2xl sm:px-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-red-400/10 blur-3xl" />
      <p className="flex items-center gap-2 font-serif text-[10px] font-black uppercase tracking-[0.28em] text-rose-300">
        <History className="h-3.5 w-3.5" /> Historical Earthquake Records
      </p>
      <h1 className="mt-2 bg-gradient-to-r from-rose-300 via-orange-300 to-amber-200 bg-clip-text font-serif text-2xl font-black tracking-tight text-transparent sm:text-3xl">
        Dig through decades of seismic history.
      </h1>
      <p className="mt-2 max-w-2xl text-sm font-medium text-slate-400">
        Search official records from 1990 onward. Filter by country, date range, and magnitude, then trace every match on the interactive map.
      </p>
    </div>
  );
}


