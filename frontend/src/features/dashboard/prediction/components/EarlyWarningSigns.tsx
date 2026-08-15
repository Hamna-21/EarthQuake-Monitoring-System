import { AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';
import { facts, order, signs, tiers } from '../earlyWarningSigns.data';

/* Static sign configuration is owned by the prediction feature data module. */

export default function EarlyWarningSigns() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-transparent p-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-5">
      <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-300/30 bg-amber-400/15 shadow-[0_0_14px_rgba(251,191,36,0.35)]">
          <AlertTriangle className="h-4 w-4 text-amber-300" />
        </span>
        <div>
          <h2 className="font-serif text-lg font-black tracking-tight text-white">Signs before an earthquake</h2>
          <p className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Sparkles className="h-3 w-3 text-indigo-300" />
            Ranked by scientific reliability
          </p>
        </div>
      </div>

      <div className="relative mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className={`rounded-2xl border border-white/10 bg-gradient-to-br ${f.bg} to-transparent p-3 backdrop-blur-md`}>
            <f.icon className={`h-3.5 w-3.5 ${f.color}`} />
            <p className={`mt-1.5 text-lg font-black leading-none ${f.color}`}>{f.value}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-300">{f.label}</p>
            <p className="mt-1 text-[10px] leading-3.5 text-slate-400">{f.hint}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-5 grid gap-3 lg:grid-cols-3">
        {order.map((tier) => {
          const { label, hint, icon: Icon, dot, text, ring, from, via, badge } = tiers[tier];
          const items = signs.filter((s) => s.tier === tier);
          return (
            <div key={tier} className={`rounded-2xl border border-white/10 bg-gradient-to-br ${from} ${via} to-transparent p-3 shadow-inner ring-1 ${ring} backdrop-blur-md transition-colors hover:border-white/20`}>
              <div className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/10 ${text}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className={`text-xs font-bold uppercase tracking-wide ${text}`}>{label}</span>
                <span className={`ml-auto rounded-full border px-2 py-0.5 text-[10px] font-black ${badge}`}>{items.length} signs</span>
                <span className={`h-2 w-2 rounded-full ${dot}`} />
              </div>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">{hint}</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
                {items.map((s) => (
                  <li key={s.text} className="flex gap-2 border-b border-white/10 py-2 text-xs leading-4 last:border-0">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                    <span>{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <div className="rounded-2xl border border-orange-300/20 bg-gradient-to-br from-orange-400/10 via-red-400/[0.04] to-transparent p-5 shadow-inner ring-1 ring-orange-400/15 backdrop-blur-md lg:col-span-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-indigo-200">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-indigo-200">Forecasting vs. prediction</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-4 text-slate-400">What science can and can't tell us in advance</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
            <li className="flex gap-2.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2 hover:bg-white/[0.06]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
              <span>Long-term forecasts give probabilities (e.g. "a major earthquake is likely in this region within 30 years"), not exact dates.</span>
            </li>
            <li className="flex gap-2.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2 hover:bg-white/[0.06]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
              <span>Early-warning systems detect an earthquake that has already started and race the shaking to nearby cities, buying seconds to act.</span>
            </li>
            <li className="flex gap-2.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2 hover:bg-white/[0.06]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
              <span>No current model can reliably state the exact day, location, and magnitude of a future earthquake in advance.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
