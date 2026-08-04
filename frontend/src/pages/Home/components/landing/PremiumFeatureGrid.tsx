import { Brain, ChartNoAxesCombined, Radar, ShieldCheck } from 'lucide-react';
import PremiumCard from './PremiumCard';
import SectionShell from './SectionShell';

const features = [
  { title: 'Real-Time Monitoring', text: 'Track global seismic activity as it develops.', icon: Radar },
  { title: 'AI Powered Insights', text: 'Translate complex readings into clear risk signals.', icon: Brain },
  { title: 'Emergency Preparedness', text: 'Guide families and teams before panic begins.', icon: ShieldCheck },
  { title: 'Enterprise Analytics', text: 'Compare patterns, magnitude, depth, and regional load.', icon: ChartNoAxesCombined },
];

export default function PremiumFeatureGrid() {
  return (
    <SectionShell
      eyebrow="Platform Capabilities"
      title="Built for decisions, not noise."
      subtitle="Every surface is designed to help people understand what happened, where, and what to do next."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map(({ title, text, icon: Icon }) => (
          <PremiumCard key={title}>
            <Icon className="h-8 w-8 text-red-300" />
            <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
            <p className="mt-2 leading-6 text-slate-300">{text}</p>
          </PremiumCard>
        ))}
      </div>
    </SectionShell>
  );
}
