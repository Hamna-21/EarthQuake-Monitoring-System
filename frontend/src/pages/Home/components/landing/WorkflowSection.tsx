import { Bot, Eye, MapPinned, RadioTower, ShieldAlert, Waves } from 'lucide-react';
import PremiumCard from './PremiumCard';
import SectionShell from './SectionShell';

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
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map(({ label, icon: Icon }, index) => (
          <PremiumCard key={label}>
            <div className="flex items-center justify-between gap-4">
              <Icon className="h-8 w-8 text-cyan-200" />
              <span className="text-xs font-black text-slate-500">0{index + 1}</span>
            </div>
            <h3 className="mt-8 text-2xl font-black text-white">{label}</h3>
            <div className="mt-5 h-1 bg-gradient-to-r from-cyan-300 via-red-400 to-transparent" />
          </PremiumCard>
        ))}
      </div>
    </SectionShell>
  );
}
