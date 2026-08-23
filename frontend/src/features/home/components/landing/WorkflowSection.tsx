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
  { label: 'Earthquake Monitoring System Receives Data', icon: Waves },
  { label: 'AI Analysis', icon: Bot },
  { label: 'Risk Assessment', icon: ShieldAlert },
  { label: 'Visualization', icon: MapPinned },
  { label: 'Safety Guidance', icon: Eye },
];

/** Renders or coordinates workflow section for this frontend module. */
export default function WorkflowSection() {
  return (
    <SectionShell
      eyebrow="How Earthquake Monitoring System Works"
      title="From seismic signal to safety action."
      subtitle="The workflow keeps scientific data readable for operators, families, and response teams." >
      <div className="grid max-w-6xl gap-4 xl:grid-cols-2 xl:items-stretch">
        {/* LEFT — IMAGE */}
        <div className="relative min-h-[400px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
          <img
            src="/images/earthfeatures.png"
            alt="Earthquake Monitoring System Earth visualization"
            className="absolute inset-0 h-full w-full object-contain"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/30 to-transparent" />
        </div>

        {/* RIGHT — WORKFLOW CARDS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {steps.map(({ label, icon: Icon }, index) => (
            <PremiumCard key={label}>
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-cyan-200" />

                <span className="text-xs font-bold text-slate-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold text-white">
                {label}
              </h3>

              <div className="mt-3 h-0.5 bg-gradient-to-r from-cyan-300 via-red-400 to-transparent" />
            </PremiumCard>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
