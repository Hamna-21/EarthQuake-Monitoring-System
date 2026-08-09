import type { Earthquake } from '../../../../types';
import MapCanvas from '../../../../components/map/MapCanvas';

export default function HistoryMapSection({
  title,
  description,
  events,
  selectedId,
  loading,
  onSelect,
}: {
  title: string;
  description: string;
  events: Earthquake[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (event: Earthquake) => void;
}) {
  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl border border-cyan-400/15 bg-white/[0.05] shadow-2xl shadow-cyan-950/20">
      <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-violet-500/10 px-5 py-3">
        <h2 className="font-serif text-lg font-black text-white">{title}</h2>
        <p className="text-sm font-medium text-slate-300">{description}</p>
      </div>
      <MapCanvas events={events} selectedId={selectedId} onSelect={onSelect} />
      {(loading || !events.length) && (
        <div className="absolute right-4 top-20 z-[900] max-w-xs rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-3 text-sm text-slate-200 shadow-2xl backdrop-blur-xl">
          <p className="font-serif font-black text-white">{loading ? 'Loading map records...' : 'No map markers found'}</p>
          <p className="mt-1 text-xs text-slate-400">{loading ? 'GeoPulse is fetching matching earthquakes.' : 'Try a wider date range, lower magnitude, or different location.'}</p>
        </div>
      )}
    </section>
  );
}
