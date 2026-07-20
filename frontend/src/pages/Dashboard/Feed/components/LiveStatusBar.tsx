import { Activity, Clock, RadioTower, Wifi } from 'lucide-react';

interface LiveStatusBarProps {
  count: number;
  isLoading: boolean;
  error: string | null;
}

export default function LiveStatusBar({ count, isLoading, error }: LiveStatusBarProps) {
  const connected = !error;
  return (
    <section className="grid gap-3 font-serif rounded-lg border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur md:grid-cols-4">
      <Status icon={Activity} label="Earthquakes Today" value={count} gradient="from-red-500 to-orange-500" tone="text-red-700" pulse />
      <Status icon={Wifi} label="Status" value={connected ? 'Connected' : 'Disconnected'} gradient={connected ? 'from-emerald-400 to-teal-500' : 'from-red-500 to-rose-600'} tone={connected ? 'text-emerald-700' : 'text-red-700'} />
      <Status icon={Clock} label="Last Updated" value={new Date().toLocaleTimeString()} gradient="from-violet-400 to-fuchsia-500" tone="text-violet-700" />
      <Status icon={RadioTower} label="Monitoring" value={isLoading ? 'Refreshing' : 'Live'} gradient="from-cyan-400 to-blue-500" tone="text-cyan-700" pulse={isLoading} />
    </section>
  );
}

function Status({ icon: Icon, label, value, gradient, tone, pulse }: {
  icon: typeof Activity; label: string; value: string | number; gradient: string; tone: string; pulse?: boolean;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-white">
      <span className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-105`}>
        <Icon className="h-5 w-5" />
        {pulse && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-white bg-white/90" />}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <strong className={`block truncate font-mono text-sm font-black ${tone}`}>{value}</strong>
      </div>
    </div>
  );
}