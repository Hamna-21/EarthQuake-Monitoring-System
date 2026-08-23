import { BarChart3, Bell, Globe2, ListChecks, Map, ShieldAlert } from 'lucide-react';
import PremiumCard from '@/features/home/components/landing/PremiumCard';
import SectionShell from '@/features/home/components/landing/SectionShell';

const modules = [
  { title: 'Overview', text: 'Mission control for live seismic status.', icon: BarChart3 },
  { title: 'Analytics', text: 'Magnitude, depth, and trend intelligence.', icon: Globe2 },
  { title: 'Map', text: 'Geospatial monitoring with event focus.', icon: Map },
  { title: 'Safety Hub', text: 'Preparedness tools for emergency response.', icon: ShieldAlert },
  { title: 'Nearby', text: 'Location-aware earthquake awareness.', icon: Bell },
  { title: 'Live Feed', text: 'Fresh records with filtering and actions.', icon: ListChecks },
];

/** Renders or coordinates dashboard preview for this frontend module. */
export default function DashboardPreview() {
  return (
    <SectionShell
      eyebrow="Dashboard Preview"
      title="Everything important, one command surface."
      subtitle="The dashboard modules feel connected, focused, and ready for repeated use."
    >
      <div className="grid max-w-5xl gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modules.map(({ title, text, icon: Icon }) => (
          <PremiumCard key={title}>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-cyan-300/10 text-cyan-200">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-white">{title}</h3>
                <p className="mt-0.5 text-sm text-slate-400">{text}</p>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </SectionShell>
  );
}
/** Shows a static preview of the dashboard experience on the landing page. */
