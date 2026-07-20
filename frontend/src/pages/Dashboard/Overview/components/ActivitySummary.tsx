import { Earthquake } from '../../../../types';

const tiers = [
  { max: 10, label: 'LOW', word: 'Calm', ring: '#10b981', text: 'text-emerald-600', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', glow: 'rgba(16,185,129,0.18)' },
  { max: 25, label: 'MODERATE', word: 'Watchful', ring: '#f59e0b', text: 'text-amber-600', chip: 'bg-amber-50 text-amber-700 border-amber-200', glow: 'rgba(245,158,11,0.18)' },
  { max: 45, label: 'HIGH', word: 'Elevated', ring: '#f97316', text: 'text-orange-600', chip: 'bg-orange-50 text-orange-700 border-orange-200', glow: 'rgba(249,115,22,0.18)' },
  { max: 101, label: 'EXTREME', word: 'Critical', ring: '#dc2626', text: 'text-red-700', chip: 'bg-red-50 text-red-700 border-red-200', glow: 'rgba(220,38,38,0.2)' },
];

export default function ActivitySummary({ earthquakes }: { earthquakes: Earthquake[] }) {
  const highRisk = earthquakes.filter((event) => event.magnitude >= 5 || event.alert).length;
  const total = Math.max(earthquakes.length, 1);
  const score = Math.min(100, Math.round((highRisk / total) * 100));
  const tier = tiers.find((t) => score < t.max)!;

  return (
    <article className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-8 shadow-sm backdrop-blur">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl" style={{ background: tier.glow }} />
      <div className="pointer-events-none absolute -left-16 -bottom-20 h-64 w-64 rounded-full blur-3xl opacity-60" style={{ background: tier.glow }} />

      <div className="relative flex flex-col items-center text-center">
        <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-700">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tier.ring }} />
          Risk Index
          <span className={`ml-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold ${tier.chip}`}>
            {tier.word}
          </span>
        </p>

        <div className="relative mt-6">
          <div
            className="grid h-36 w-36 place-items-center rounded-full p-2 transition-all duration-700"
            style={{
              background: `conic-gradient(${tier.ring} ${score}%, rgba(15,23,42,0.08) 0)`,
              boxShadow: `0 0 28px ${tier.glow}`,
            }}
          >
            <div className="grid h-full w-full place-items-center rounded-full bg-white shadow-inner">
              <strong className="font-serif text-4xl font-black text-slate-950">{score}</strong>
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">of 100</span>
            </div>
          </div>
        </div>

        <h2 className="mt-5 font-serif text-3xl font-black italic tracking-tight" style={{ color: tier.ring }}>
          {tier.label}
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          <span className="font-bold text-slate-900">{highRisk}</span> of{' '}
          <span className="font-bold text-slate-900">{earthquakes.length}</span> events flagged
          as high-magnitude or alerted.
        </p>

        <div className="relative mt-7 w-full max-w-md">
          <div className="flex h-2 overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-200/60">
            <div className="h-full flex-1 bg-emerald-400" />
            <div className="h-full flex-1 bg-amber-400" />
            <div className="h-full flex-1 bg-orange-400" />
            <div className="h-full flex-1 bg-red-500" />
          </div>
          <div
            className="relative -mt-[9px] h-4 w-4 rounded-full border-2 border-white shadow-sm transition-all duration-700"
            style={{ marginLeft: `calc(${score}% - 8px)`, backgroundColor: tier.ring, boxShadow: `0 0 8px 2px ${tier.glow}` }}
          />
          <div className="mt-2 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wide text-slate-400">
            <span>Calm</span>
            <span>Critical</span>
          </div>
        </div>
      </div>
    </article>
  );
}