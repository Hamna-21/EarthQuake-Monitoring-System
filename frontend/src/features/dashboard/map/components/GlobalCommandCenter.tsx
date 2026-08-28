import { useState } from 'react';
import type { Earthquake } from '@/types';
import InteractiveGlobePanel from '@/features/dashboard/map/components/InteractiveGlobePanel';
import { GlobeLegend } from '@/features/dashboard/map/components/InteractiveGlobePanel';
import GlobeViewControls from '@/features/dashboard/map/components/GlobeViewControls';
import type { View } from '@/features/dashboard/map/components/globeData';
import GlobalMapAnalytics from '@/features/dashboard/map/components/GlobalMapAnalytics';
import { usePlaceFocus } from '@/features/dashboard/map/hooks/usePlaceFocus';

/** Keeps the globe as the visual hero and places shared view controls and analytics beneath it. */
export default function GlobalCommandCenter({ events, onSelect, onDetails, globalSearch = '' }: { events: Earthquake[]; onSelect: (event: Earthquake) => void; onDetails: (event: Earthquake) => void; globalSearch?: string; lastUpdated?: number | null }) {
  const [view, setView] = useState<View>('night');
  const { place: focusPlace } = usePlaceFocus(globalSearch);
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#030817] shadow-2xl backdrop-blur-2xl">
      <div className="relative z-20 flex flex-wrap items-start justify-between gap-3 px-3 pb-2 pt-2 sm:px-4">
        <div>
          <h2 className="font-serif text-lg font-black tracking-tight text-white sm:text-xl">Global Earthquake Map</h2>
          <p className="mt-1 text-sm font-medium text-slate-300">Interactive global earthquake activity with the same live USGS dataset.</p>
        </div>
        <GlobeViewControls view={view} onChange={setView} />
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center gap-2">
          <InteractiveGlobePanel events={events} onSelect={onSelect} onDetails={onDetails} autoRotate focusLocation={focusPlace} focusLabel={focusPlace?.label} popupMode="compact" view={view} onViewChange={setView} legendOutside bare globeHeight={520} />
          <GlobeLegend outside />
        </div>
      </div>
      <div className="p-2 sm:p-3"><GlobalMapAnalytics events={events} /></div>
    </section>
  );
}
