import { Flame, Globe2, Search, Waves } from 'lucide-react';

const tones = {
  cyan: 'from-cyan-500/30 via-sky-500/15 to-blue-700/25 text-cyan-100 border-cyan-300/30 shadow-cyan-950/40',
  red: 'from-red-600/35 via-orange-500/20 to-amber-400/25 text-orange-100 border-orange-300/30 shadow-orange-950/40',
  emerald: 'from-emerald-500/30 via-teal-500/15 to-cyan-400/25 text-emerald-100 border-emerald-300/30 shadow-emerald-950/40',
  violet: 'from-violet-500/30 via-fuchsia-500/15 to-rose-500/25 text-violet-100 border-violet-300/30 shadow-violet-950/40',
};

const bars = {
  cyan: 'from-cyan-300 via-sky-400 to-blue-500',
  red: 'from-red-500 via-orange-400 to-amber-300',
  emerald: 'from-emerald-300 via-teal-400 to-cyan-300',
  violet: 'from-fuchsia-400 via-violet-400 to-indigo-400',
};

type Labels = Partial<Record<'records' | 'strongest' | 'countries' | 'tsunami', string>>;

export default function HistoryMetrics({ records, strongest, countries, tsunami, labels = {} }: { records: number; strongest: string; countries: number; tsunami: number; labels?: Labels; }) {
  const cards = [
    [labels.records ?? 'Records Found', String(records), 'Current results', Search, tones.cyan, bars.cyan],
    [labels.strongest ?? 'Strongest', strongest, 'Maximum magnitude', Flame, tones.red, bars.red],
    [labels.countries ?? 'Countries', String(countries), 'Extracted from locations', Globe2, tones.emerald, bars.emerald],
    [labels.tsunami ?? 'Tsunami', String(tsunami), 'Official tsunami flag', Waves, tones.violet, bars.violet],
  ] as const;

  return (
    <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, help, Icon, tone, bar]) => (
        <article key={label} className={`group relative min-h-36 overflow-hidden rounded-2xl border bg-gradient-to-br ${tone} p-5 shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl`}>
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/14 blur-2xl transition group-hover:bg-white/25" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] opacity-95">{label}</p>
              <p className="mt-4 font-serif text-3xl font-black leading-none text-white" title={value}>{value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-200/90">{help}</p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${bar}`} />
              </div>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/12 shadow-lg ring-1 ring-white/15"><Icon className="h-4 w-4" /></span>
          </div>
        </article>
      ))}
    </section>
  );
}
