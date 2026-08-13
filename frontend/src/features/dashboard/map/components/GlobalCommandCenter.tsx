import type { Earthquake } from '@/types';
import InteractiveGlobePanel from '@/features/dashboard/map/components/InteractiveGlobePanel';
import GlobalMapAnalytics from '@/features/dashboard/map/components/GlobalMapAnalytics';

export default function GlobalCommandCenter({ events, onSelect, onDetails }: { events: Earthquake[]; onSelect: (event: Earthquake) => void; onDetails: (event: Earthquake) => void; lastUpdated?: number | null }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-[#071321]/95 to-[#030817] p-1 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-2">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-cyan-300/[0.08] via-orange-300/[0.03] to-transparent" />
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-3 pb-2 pt-2 sm:px-4">
        <div>
          <p className="font-serif text-[11px] font-black uppercase tracking-[0.22em] text-cyan-200">Global Earth activity</p>
          <h2 className="mt-1 font-serif text-lg font-black tracking-tight text-white sm:text-xl">Live geographic overview</h2>
        </div>
        <span className="rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 font-serif text-[11px] font-bold text-orange-100">Earthquake Monitoring System</span>
      </div>
      <InteractiveGlobePanel events={events} onSelect={onSelect} onDetails={onDetails} autoRotate popupMode="compact" />
      <div className="p-2 sm:p-3"><GlobalMapAnalytics events={events} /></div>
    </section>
  );
}
