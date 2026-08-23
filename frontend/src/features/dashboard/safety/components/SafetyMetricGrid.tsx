import { ClipboardCheck, HeartPulse, LifeBuoy, PhoneCall } from 'lucide-react';
import SafetyCard from '@/features/dashboard/safety/components/SafetyCard';

const metrics = [
  { label: 'Preparedness Score', value: '82%', icon: HeartPulse, tone: 'text-emerald-200' },
  { label: 'Emergency Kit', value: 'Ready', icon: LifeBuoy, tone: 'text-cyan-200' },
  { label: 'Family Plan', value: '3 steps', icon: ClipboardCheck, tone: 'text-orange-200' },
  { label: 'Contacts', value: 'Priority', icon: PhoneCall, tone: 'text-red-200' },
];

/** Renders or coordinates safety metric grid for this frontend module. */
export default function SafetyMetricGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, value, icon: Icon, tone }) => (
        <SafetyCard key={label} className="transition hover:-translate-y-0.5 hover:border-orange-300/20">
          <Icon className={`h-6 w-6 ${tone}`} />
          <p className="mt-3 font-serif text-2xl font-black text-white">{value}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
            {label}
          </p>
        </SafetyCard>
      ))}
    </div>
  );
}
/** Arranges safety metrics into the responsive preparedness summary grid. */
