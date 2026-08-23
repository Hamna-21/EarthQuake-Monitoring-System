import {
  ClipboardCheck,
  HeartPulse,
  LifeBuoy,
  ShieldCheck,
} from 'lucide-react';

import PremiumCard from '@/features/home/components/landing/PremiumCard';
import SectionShell from '@/features/home/components/landing/SectionShell';

const items = [
  { title: 'Preparedness Score', value: '82%', icon: ShieldCheck },
  { title: 'Emergency Kit', value: 'Ready list', icon: LifeBuoy },
  { title: 'Family Plan', value: 'Shared steps', icon: HeartPulse },
  { title: 'Checklist', value: 'Drop, cover, hold', icon: ClipboardCheck },
];

/** Renders or coordinates safety preview for this frontend module. */
export default function SafetyPreview() {
  return (
    <SectionShell
      eyebrow="Safety Hub Preview"
      title="Preparedness without panic."
      subtitle="Safety tools share the same premium visual language as the monitoring dashboard."
      backgroundImage="/images/safer.jpg"
    >
      <div className="grid max-w-5xl gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map(({ title, value, icon: Icon }) => (
          <PremiumCard key={title}>
            <Icon className="h-6 w-6 text-emerald-200" />

            <p className="mt-3.5 text-lg font-black text-white">
              {value}
            </p>

            <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              {title}
            </p>
          </PremiumCard>
        ))}
      </div>
    </SectionShell>
  );
}
/** Previews the safety-information experience available in the application. */
