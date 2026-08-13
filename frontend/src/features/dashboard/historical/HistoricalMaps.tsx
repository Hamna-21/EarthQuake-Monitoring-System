import { Globe2 } from 'lucide-react';
import type { DashboardProps } from '@/features/dashboard/types';
import HistoryPageShell from '@/features/dashboard/historical/components/HistoryPageShell';

export default function HistoricalMapsPage(props: DashboardProps) {
  return (
    <section className="space-y-5">
      <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-2.5 font-serif text-sm font-bold text-cyan-100 backdrop-blur-xl">
        <Globe2 className="h-4 w-4" /> Global Historical Map
      </div>
      <HistoryPageShell
        {...props}
        scope="global"
        label="Global Earthquake History"
        title="Explore historical earthquakes worldwide"
        description="Search global seismic events by date, magnitude, country, or region."
        mapTitle="Global Historical Map"
        mapDescription="Markers represent earthquake records matching the selected filters."
      />
    </section>
  );
}
