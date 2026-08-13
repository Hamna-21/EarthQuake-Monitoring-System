import type { Earthquake } from '@/types';
import InteractiveGlobePanel from '@/features/dashboard/map/components/InteractiveGlobePanel';

export default function HistoryMapSection({
  title,
  description,
  events,
  loading,
  onSelect,
  onDetails,
  focusLocation,
}: {
  title: string;
  description: string;
  events: Earthquake[];
  loading: boolean;
  onSelect: (event: Earthquake) => void;
  onDetails?: (event: Earthquake) => void;
  focusLocation?: { lat: number; lng: number; label?: string; altitude?: number } | null;
}) {
  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl border border-cyan-400/15 bg-white/[0.05] shadow-2xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-violet-500/10 px-5 py-3">
        <div><h2 className="font-serif text-lg font-black text-white">{title}</h2><p className="text-sm font-medium text-slate-300">{description}</p></div>
      </div>
      <InteractiveGlobePanel events={events} onSelect={onSelect} onDetails={onDetails ?? onSelect} autoRotate={false} focusLocation={focusLocation} focusLabel={focusLocation?.label} popupMode="historical" />
      {(loading || !events.length) && (
        <div className="absolute right-4 top-20 z-[900] max-w-xs rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 text-sm text-slate-200 shadow-2xl backdrop-blur-xl">
          <p className="font-serif font-black text-white">{loading ? 'Loading map records...' : 'No map markers found'}</p>
          <p className="mt-1 text-xs text-slate-400">{loading ? 'Earthquake Monitoring System is fetching matching earthquakes.' : 'Try a wider date range, lower magnitude, or different location.'}</p>
        </div>
      )}
    </section>
  );
}
