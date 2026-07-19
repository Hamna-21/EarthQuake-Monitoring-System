import { Activity, Clock, RadioTower, Wifi } from 'lucide-react';

interface LiveStatusBarProps {
  count: number;
  isLoading: boolean;
  error: string | null;
}

export default function LiveStatusBar({ count, isLoading, error }: LiveStatusBarProps) {
  const connected = !error;
  return (
    <section className="grid gap-3 rounded-3xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur md:grid-cols-4">
      <Status icon={Activity} label="Earthquakes Today" value={count} tone="text-red-700" />
      <Status icon={Wifi} label="API Status" value={connected ? 'Connected' : 'Disconnected'} tone={connected ? 'text-emerald-700' : 'text-red-700'} />
      <Status icon={Clock} label="Last Updated" value={new Date().toLocaleTimeString()} tone="text-slate-800" />
      <Status icon={RadioTower} label="Monitoring" value={isLoading ? 'Refreshing' : 'Live'} tone="text-cyan-700" />
    </section>
  );
}

function Status({ icon: Icon, label, value, tone }: { icon: typeof Activity; label: string; value: string | number; tone: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
      <span className={`grid h-10 w-10 place-items-center rounded-xl bg-white ${tone}`}><Icon className="h-5 w-5" /></span>
      <div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p><strong className={`text-sm font-black ${tone}`}>{value}</strong></div>
    </div>
  );
}
