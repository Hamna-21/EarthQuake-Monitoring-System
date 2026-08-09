import { AlertTriangle, Activity, Users, FlaskConical } from 'lucide-react';

type Reliability = 'measured' | 'reported' | 'unreliable';

interface Sign {
  text: string;
  tier: Reliability;
}

const signs: Sign[] = [
  { tier: 'measured', text: 'Small tremors or foreshocks in the days or hours before a larger quake, though not every earthquake has them.' },
  { tier: 'measured', text: 'Slow, gradual tilting or ground deformation near fault lines, tracked over weeks or months by tiltmeters and GPS.' },
  { tier: 'measured', text: 'Water levels in wells and springs rising, falling, or turning muddy without a clear cause.' },
  { tier: 'measured', text: 'Unusual gas emissions, such as radon, sometimes recorded near fault zones before an event.' },
  { tier: 'reported', text: 'Cracks, bulges, or sudden changes in the ground surface near active fault lines.' },
  { tier: 'reported', text: 'Small landslides or rockfalls in hilly areas, which can indicate shifting ground stress.' },
  { tier: 'reported', text: 'Minor, repeated cracking sounds underground reported by residents near fault zones.' },
  { tier: 'unreliable', text: 'Livestock and wild animals behaving unusually  widely reported anecdotally, but not scientifically confirmed.' },
  { tier: 'unreliable', text: 'Slight shifts in local magnetic or electrical fields  studied, but not considered a reliable indicator.' },
];

const tiers: Record<Reliability, { label: string; hint: string; icon: typeof Activity; dot: string; text: string }> = {
  measured: {
    label: 'Instrument-detectable',
    hint: 'Tracked by seismic, geodetic, or hydrological sensors',
    icon: Activity,
    dot: 'bg-emerald-400',
    text: 'text-emerald-200',
  },
  reported: {
    label: 'Resident-reported',
    hint: 'Anecdotal patterns near fault zones, not independently verified',
    icon: Users,
    dot: 'bg-amber-400',
    text: 'text-amber-200',
  },
  unreliable: {
    label: 'Studied, not reliable',
    hint: 'Investigated by researchers but lacks predictive value',
    icon: FlaskConical,
    dot: 'bg-rose-400',
    text: 'text-rose-200',
  },
};

const order: Reliability[] = ['measured', 'reported', 'unreliable'];

export default function EarlyWarningSigns() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-300" />
        <h2 className="font-serif text-xl font-black text-white">Signs before an earthquake</h2>
      </div>

      <div className="mt-4 space-y-4">
        {order.map((tier) => {
          const { label, hint, icon: Icon, dot, text } = tiers[tier];
          const items = signs.filter((s) => s.tier === tier);
          return (
            <div key={tier} className="rounded-xl border border-white/5 bg-black/20 p-3">
              <div className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${text}`} />
                <span className={`text-xs font-semibold uppercase tracking-wide ${text}`}>{label}</span>
                <span className={`ml-auto h-1.5 w-1.5 rounded-full ${dot}`} />
              </div>
              <p className="mt-1 text-[11px] leading-4 text-slate-400">{hint}</p>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-300">
                {items.map((s) => (
                  <li key={s.text} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                    <span>{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      
    </section>
  );
}