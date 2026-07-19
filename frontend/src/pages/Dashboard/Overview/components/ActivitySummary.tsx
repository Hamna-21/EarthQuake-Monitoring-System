import { Earthquake } from '../../../../types';

export default function ActivitySummary({ earthquakes }: { earthquakes: Earthquake[] }) {
  const highRisk = earthquakes.filter((event) => event.magnitude >= 5 || event.alert).length;
  const score = Math.min(100, Math.round((highRisk / Math.max(earthquakes.length, 1)) * 100));
  const label = score > 45 ? 'EXTREME' : score > 25 ? 'HIGH' : score > 10 ? 'MODERATE' : 'LOW';
  const color = score > 45 ? 'text-red-600' : score > 25 ? 'text-orange-500' : score > 10 ? 'text-yellow-500' : 'text-green-500';

  return (
    <article className="rounded-3xl border border-white/70 bg-slate-950 p-7 text-white shadow-2xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Global Activity Level</p>
      <div className="mt-7 flex flex-col items-center gap-6 sm:flex-row">
        <div className="grid h-40 w-40 place-items-center rounded-full bg-[conic-gradient(#ef4444_var(--score),rgba(255,255,255,.12)_0)] p-3" style={{ '--score': `${score}%` } as React.CSSProperties}>
          <div className="grid h-full w-full place-items-center rounded-full bg-slate-950">
            <strong className={`text-3xl font-black ${color}`}>{score}%</strong>
          </div>
        </div>
        <div>
          <h2 className={`text-5xl font-black ${color}`}>{label}</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Current activity blends magnitude, alerts, and event volume into a quick operations signal.
          </p>
        </div>
      </div>
    </article>
  );
}
