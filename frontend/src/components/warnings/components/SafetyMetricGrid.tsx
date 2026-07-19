import { ClipboardCheck, HeartPulse, LifeBuoy, PhoneCall } from 'lucide-react';
import SafetyCard from './SafetyCard';

const metrics = [
  { label: 'Preparedness Score', value: '82%', icon: HeartPulse, tone: 'text-emerald-200' },
  { label: 'Emergency Kit', value: 'Ready', icon: LifeBuoy, tone: 'text-cyan-200' },
  { label: 'Family Plan', value: '3 steps', icon: ClipboardCheck, tone: 'text-orange-200' },
  { label: 'Contacts', value: 'Priority', icon: PhoneCall, tone: 'text-red-200' },
];

export default function SafetyMetricGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, icon: Icon, tone }) => (
        <SafetyCard key={label}>
          <Icon className={`h-7 w-7 ${tone}`} />
          <p className="mt-6 text-3xl font-black text-white">{value}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            {label}
          </p>
        </SafetyCard>
      ))}
    </div>
  );
}
