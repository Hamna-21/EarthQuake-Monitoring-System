import { Activity, Cpu, Globe, ShieldAlert } from 'lucide-react';

const stats = [
  { label: 'Active Seismographs', value: '1,428', icon: Activity },
  { label: 'Monitored Plates', value: '17 Major', icon: Globe },
  { label: 'Warnings Sent', value: '342 today', icon: ShieldAlert },
  { label: 'Core Status', value: 'Nominal', icon: Cpu },
];

/** Renders or coordinates auth stats for this frontend module. */
export default function AuthStats() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
          <Icon className="h-4 w-4 shrink-0 text-cyan-200" />
          <div className="min-w-0">
            <span className="block truncate text-sm font-black text-white">{value}</span>
            <span className="block truncate text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Presents the short informational statistics shown beside auth forms. */
