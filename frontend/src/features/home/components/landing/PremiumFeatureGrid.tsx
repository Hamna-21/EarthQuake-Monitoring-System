import {
  Bot,
  Eye,
  MapPinned,
  RadioTower,
  ShieldAlert,
  Waves,
} from 'lucide-react';

import PremiumCard from '@/features/home/components/landing/PremiumCard';
import SectionShell from '@/features/home/components/landing/SectionShell';

const steps = [
  { label: 'Earthquake Detected', icon: RadioTower },
  { label: 'GeoPulse Receives Data', icon: Waves },
  { label: 'AI Analysis', icon: Bot },
  { label: 'Risk Assessment', icon: ShieldAlert },
  { label: 'Visualization', icon: MapPinned },
  { label: 'Safety Guidance', icon: Eye },
];

export default function WorkflowSection() {
  return (
    <SectionShell
      eyebrow="How GeoPulse Works"
      title="From seismic signal to safety action."
      subtitle="The workflow keeps scientific data readable for operators, families, and response teams."
    >
      <div className="grid max-w-6xl gap-4 xl:grid-cols-2 xl:items-stretch">
        <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/65 shadow-[0_28px_90px_rgba(0,0,0,0.35)] sm:min-h-[420px]">
          <img
            src="/images/earthfeatures.png"
            alt="Digital Earth visualization"
            className="absolute inset-0 h-full w-full object-contain object-center"
          />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(4,11,34,0.3)_0%,rgba(4,11,34,0.12)_55%,rgba(4,11,34,0.04)_100%)]" />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_40%,rgba(34,211,238,0.15),transparent_50%)]" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
          {steps.map(({ label, icon: Icon }, index) => (
            <PremiumCard key={label}>
              <div className="flex items-center justify-between gap-3">
                <Icon className="h-6 w-6 text-cyan-200" />

                <span className="text-xs font-black text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-3.5 text-lg font-black text-white">
                {label}
              </h3>

              <div className="mt-3 h-1 bg-gradient-to-r from-cyan-300 via-red-400 to-transparent" />
            </PremiumCard>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}