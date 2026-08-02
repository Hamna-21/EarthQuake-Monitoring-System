import { Activity, Radio } from 'lucide-react';

export default function OverviewHero() {
  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 text-white shadow-2xl">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            Overview
          </p>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur">
            <Radio className="h-3 w-3 text-cyan-300" /> Live
          </div>
        </div>

        <h1 className="mt-3 font-serif text-2xl font-black tracking-tight sm:text-3xl">
          The ground is talking
          <span className="bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
            {' '}& we&rsquo;re listening.
          </span>
        </h1>
        <p className="mt-2 max-w-xl text-sm font-light leading-snug text-slate-300">
          Real-time global seismic activity, risk signals, and alerts in one view.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip icon={<Activity className="h-3 w-3" />} label="Real-time" tone="cyan" />
          <Chip label="Global" tone="violet" />
          <Chip label="Alert-ready" tone="red" />
        </div>
      </div>
    </section>
  );
}

function Chip({ icon, label, tone }: { icon?: React.ReactNode; label: string; tone: 'cyan' | 'violet' | 'red' }) {
  const styles = {
    cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
    violet: 'border-violet-400/20 bg-violet-400/10 text-violet-200',
    red: 'border-red-400/20 bg-red-400/10 text-red-200',
  };
  return <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[tone]}`}>{icon}{label}</span>;
}
