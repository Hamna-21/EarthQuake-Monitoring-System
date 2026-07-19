import { BarChart3, Bell, Globe2, ListChecks, Map, ShieldAlert } from 'lucide-react';
import PremiumCard from './PremiumCard';
import SectionShell from './SectionShell';

const modules = [
  { title: 'Overview', text: 'Mission control for live seismic status.', icon: BarChart3 },
  { title: 'Analytics', text: 'Magnitude, depth, and trend intelligence.', icon: Globe2 },
  { title: 'Map', text: 'Geospatial monitoring with event focus.', icon: Map },
  { title: 'Safety Hub', text: 'Preparedness tools for emergency response.', icon: ShieldAlert },
  { title: 'Nearby', text: 'Location-aware earthquake awareness.', icon: Bell },
  { title: 'Live Feed', text: 'Fresh records with filtering and actions.', icon: ListChecks },
];

export default function DashboardPreview() {
  return (
    <SectionShell
      eyebrow="Dashboard Preview"
      title="Everything important, one command surface."
      subtitle="The dashboard modules feel connected, focused, and ready for repeated use."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map(({ title, text, icon: Icon }) => (
          <PremiumCard key={title}>
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center bg-cyan-300/10 text-cyan-200">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-xl font-black text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{text}</p>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </SectionShell>
  );
}
