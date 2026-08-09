import { AlertTriangle, Activity, Users, FlaskConical, Sparkles, TrendingUp, Info, Globe2, Timer } from 'lucide-react';

type Reliability = 'measured' | 'reported' | 'unreliable';

interface Sign {
  text: string;
  tier: Reliability;
}

const signs: Sign[] = [
  { tier: 'measured', text: 'Small tremors or foreshocks in the days or hours before a larger earthquake, though not every earthquake has them.' },
  { tier: 'measured', text: 'Slow, gradual tilting or ground deformation near fault lines, tracked over weeks or months by tiltmeters and GPS.' },
  { tier: 'measured', text: 'Water levels in wells and springs rising, falling, or turning muddy without a clear cause.' },
  { tier: 'measured', text: 'Unusual gas emissions, such as radon, sometimes recorded near fault zones before an event.' },
  { tier: 'measured', text: 'Micro-changes in seismic wave velocity through rock, picked up by dense sensor arrays.' },
  { tier: 'measured', text: 'Clusters of repeating micro-earthquakes along a locked fault segment, seen in aftershock catalogs.' },
  { tier: 'reported', text: 'Cracks, bulges, or sudden changes in the ground surface near active fault lines.' },
  { tier: 'reported', text: 'Small landslides or rockfalls in hilly areas, which can indicate shifting ground stress.' },
  { tier: 'reported', text: 'Minor, repeated cracking sounds underground reported by residents near fault zones.' },
  { tier: 'reported', text: 'Sudden changes in spring or well water color, smell, or temperature noticed by locals.' },
  { tier: 'reported', text: 'Unexplained fluctuations in local tap water pressure in areas near active faults.' },
  { tier: 'unreliable', text: 'Livestock and wild animals behaving unusually — widely reported anecdotally, but not scientifically confirmed.' },
  { tier: 'unreliable', text: 'Slight shifts in local magnetic or electrical fields — studied, but not considered a reliable indicator.' },
  { tier: 'unreliable', text: 'Unusual cloud formations near fault lines — a folk belief with no accepted scientific backing.' },
  { tier: 'unreliable', text: '"Earthquake weather" — the idea that certain temperatures or calm skies precede earthquakes — is not supported by data.' },
];

const tiers: Record<Reliability, {
  label: string; hint: string; icon: typeof Activity; dot: string; text: string;
  ring: string; from: string; via: string; badge: string;
}> = {
  measured: {
    label: 'Instrument-detectable',
    hint: 'Tracked by seismic, geodetic, or hydrological sensors',
    icon: Activity,
    dot: 'bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.7)]',
    text: 'text-emerald-200',
    ring: 'ring-emerald-400/25',
    from: 'from-emerald-400/15',
    via: 'via-emerald-400/[0.04]',
    badge: 'bg-emerald-400/15 text-emerald-200 border-emerald-300/30',
  },
  reported: {
    label: 'Resident-reported',
    hint: 'Anecdotal patterns near fault zones, not independently verified',
    icon: Users,
    dot: 'bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.7)]',
    text: 'text-amber-200',
    ring: 'ring-amber-400/25',
    from: 'from-amber-400/15',
    via: 'via-amber-400/[0.04]',
    badge: 'bg-amber-400/15 text-amber-200 border-amber-300/30',
  },
  unreliable: {
    label: 'Studied, not reliable',
    hint: 'Investigated by researchers but lacks predictive value',
    icon: FlaskConical,
    dot: 'bg-rose-400 shadow-[0_0_10px_2px_rgba(251,113,133,0.7)]',
    text: 'text-rose-200',
    ring: 'ring-rose-400/25',
    from: 'from-rose-400/15',
    via: 'via-rose-400/[0.04]',
    badge: 'bg-rose-400/15 text-rose-200 border-rose-300/30',
  },
};

const order: Reliability[] = ['measured', 'reported', 'unreliable'];

const facts = [
  { icon: Globe2, label: 'Daily activity', value: '~20K+', hint: 'Earthquakes detected worldwide per year by global seismic networks (mostly minor)', color: 'text-cyan-200', bg: 'from-cyan-400/20' },
  { icon: TrendingUp, label: 'Aftershock odds', value: 'High', hint: 'Most large earthquakes are followed by aftershocks, sometimes for months', color: 'text-indigo-200', bg: 'from-indigo-400/20' },
  { icon: Timer, label: 'Warning window', value: 'Seconds', hint: 'Early-warning systems can give seconds to tens of seconds notice, not days', color: 'text-amber-200', bg: 'from-amber-400/20' },
  { icon: Info, label: 'Reliable prediction', value: 'None', hint: 'No method today reliably predicts the exact time, place, and size of an earthquake', color: 'text-rose-200', bg: 'from-rose-400/20' },
];

export default function EarlyWarningSigns() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.09] via-white/[0.04] to-transparent p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      {/* ambient glow blobs for extra glassy depth */}
      <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-300/30 bg-amber-400/15 shadow-[0_0_14px_rgba(251,191,36,0.35)]">
          <AlertTriangle className="h-4 w-4 text-amber-300" />
        </span>
        <div>
          <h2 className="font-serif text-xl font-black tracking-tight text-white">Signs before an earthquake</h2>
          <p className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Sparkles className="h-3 w-3 text-indigo-300" />
            Ranked by scientific reliability
          </p>
        </div>
      </div>

      {/* Facts & figures strip */}
      <div className="relative mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {facts.map((f) => (
          <div
            key={f.label}
            className={`rounded-xl border border-white/10 bg-gradient-to-br ${f.bg} to-transparent p-3 backdrop-blur-md`}
          >
            <f.icon className={`h-3.5 w-3.5 ${f.color}`} />
            <p className={`mt-1.5 text-lg font-black leading-none ${f.color}`}>{f.value}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-300">{f.label}</p>
            <p className="mt-1 text-[10px] leading-3.5 text-slate-400">{f.hint}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-5 space-y-4">
        {order.map((tier) => {
          const { label, hint, icon: Icon, dot, text, ring, from, via, badge } = tiers[tier];
          const items = signs.filter((s) => s.tier === tier);
          return (
            <div
              key={tier}
              className={`rounded-xl border border-white/10 bg-gradient-to-br ${from} ${via} to-transparent p-4 shadow-inner ring-1 ${ring} backdrop-blur-md transition-colors hover:border-white/20`}
            >
              <div className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/10 ${text}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className={`text-xs font-bold uppercase tracking-wide ${text}`}>{label}</span>
                <span className={`ml-auto rounded-full border px-2 py-0.5 text-[10px] font-black ${badge}`}>
                  {items.length} signs
                </span>
                <span className={`h-2 w-2 rounded-full ${dot}`} />
              </div>
              <p className="mt-1.5 text-[11px] leading-4 text-slate-400">{hint}</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
                {items.map((s) => (
                  <li
                    key={s.text}
                    className="flex gap-2.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2 transition-colors hover:bg-white/[0.06]"
                  >
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                    <span>{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Prediction reality-check panel */}
        <div className="rounded-xl border border-indigo-300/20 bg-gradient-to-br from-indigo-400/15 via-indigo-400/[0.04] to-transparent p-4 shadow-inner ring-1 ring-indigo-400/20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-indigo-200">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wide text-indigo-200">Forecasting vs. prediction</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-4 text-slate-400">
            What science can and can't tell us in advance
          </p>
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