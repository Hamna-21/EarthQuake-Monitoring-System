import { ClipboardCheck, HeartPulse, LifeBuoy, ShieldCheck } from 'lucide-react';
import PremiumCard from './PremiumCard';
import SectionShell from './SectionShell';

const items = [
  { title: 'Preparedness Score', value: '82%', icon: ShieldCheck },
  { title: 'Emergency Kit', value: 'Ready list', icon: LifeBuoy },
  { title: 'Family Plan', value: 'Shared steps', icon: HeartPulse },
  { title: 'Checklist', value: 'Drop, cover, hold', icon: ClipboardCheck },
];

export default function SafetyPreview() {
  return (
    <SectionShell
      eyebrow="Safety Hub Preview"
      title="Preparedness without panic."
      subtitle="Safety tools share the same premium visual language as the monitoring dashboard."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map(({ title, value, icon: Icon }) => (
          <PremiumCard key={title}>
            <Icon className="h-8 w-8 text-emerald-200" />
            <p className="mt-8 text-2xl font-black text-white">{value}</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              {title}
            </p>
          </PremiumCard>
        ))}
      </div>
    </SectionShell>
  );
}
