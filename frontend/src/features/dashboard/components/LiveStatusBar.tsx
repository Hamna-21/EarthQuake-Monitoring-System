import { Activity, Clock, RadioTower, Wifi } from 'lucide-react';

const STATUSES = (count: number, connected: boolean, isLoading: boolean) => [
  { icon: Activity, label: 'Loaded Events', value: count, gradient: 'from-red-500 to-orange-500', tone: 'text-red-200', pulse: true },
  { icon: Wifi, label: 'Status', value: connected ? 'Connected' : 'Disconnected', gradient: connected ? 'from-emerald-400 to-teal-500' : 'from-red-500 to-rose-600', tone: connected ? 'text-emerald-200' : 'text-red-200' },
  { icon: Clock, label: 'Last Updated', value: new Date().toLocaleTimeString(), gradient: 'from-violet-400 to-fuchsia-500', tone: 'text-violet-200' },
  { icon: RadioTower, label: 'Monitoring', value: isLoading ? 'Refreshing' : 'Live', gradient: 'from-cyan-400 to-blue-500', tone: 'text-cyan-200', pulse: isLoading },
];

/** Renders or coordinates live status bar for this frontend module. */
export default function LiveStatusBar({ count, isLoading, error }: { count: number; isLoading: boolean; error: string | null }) {
  return (
    <section className="grid gap-2 rounded-xl border border-white/10 bg-white/[0.06] p-3 font-serif backdrop-blur-xl md:grid-cols-4">
      {STATUSES(count, !error, isLoading).map(({ icon: Icon, label, value, gradient, tone, pulse }) => (
        <div key={label} className="group flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 p-2 transition-colors hover:bg-white/10">
          <span className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${gradient} text-white transition-transform group-hover:scale-105`}>
            <Icon className="h-4 w-4" />
            {pulse && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full border border-white bg-white/90" />}
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
            <strong className={`block truncate text-xs font-black ${tone}`}>{value}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}
/** Displays connection and freshness status for live earthquake data. */
