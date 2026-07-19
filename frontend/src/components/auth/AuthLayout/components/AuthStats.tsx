import { Activity, Cpu, Globe, ShieldAlert } from 'lucide-react';

const stats = [
  { label: 'Active Seismographs', value: '1,428', icon: Activity },
  { label: 'Monitored Plates', value: '17 Major', icon: Globe },
  { label: 'Warnings Sent', value: '342 today', icon: ShieldAlert },
  { label: 'Core Status', value: 'Nominal', icon: Cpu },
];

export default function AuthStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
          <Icon className="h-5 w-5 text-cyan-200" />
          <span className="mt-4 block text-lg font-black text-white">{value}</span>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
