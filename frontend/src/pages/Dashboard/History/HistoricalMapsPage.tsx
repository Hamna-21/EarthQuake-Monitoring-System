import { useState } from 'react';
import { Globe2, MapPinned } from 'lucide-react';
import { DashboardProps } from '../../../components/dashboard/types';
import HistoryPageShell from './components/HistoryPageShell';

type HistoricalTab = 'global' | 'pakistan';

export default function HistoricalMapsPage(props: DashboardProps) {
  const [tab, setTab] = useState<HistoricalTab>('global');

  return (
    <section className="space-y-5">
      <div className="inline-flex gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-1.5 backdrop-blur-xl">
        <TabButton
          active={tab === 'global'}
          icon={<Globe2 className="h-4 w-4" />}
          label="Global"
          onClick={() => setTab('global')}
          activeClasses="bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
          idleClasses="text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-100"
        />
        <TabButton
          active={tab === 'pakistan'}
          icon={<MapPinned className="h-4 w-4" />}
          label="Pakistan"
          onClick={() => setTab('pakistan')}
          activeClasses="bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg shadow-emerald-500/30"
          idleClasses="text-slate-300 hover:bg-emerald-400/10 hover:text-emerald-100"
        />
      </div>

      {tab === 'global' ? (
        <HistoryPageShell
          {...props}
          scope="global"
          label="Global Earthquake History"
          title="Explore historical earthquakes worldwide"
          description="Search global seismic events by date, magnitude, country, or region."
          mapTitle="Global Historical Map"
          mapDescription="Markers represent earthquake records matching the selected filters."
        />
      ) : (
        <HistoryPageShell
          {...props}
          scope="pakistan"
          label="Pakistan Seismic History"
          title="Explore verified earthquakes across Pakistan"
          description="Search historical seismic activity using dates, magnitude, and verified geographic records."
          mapTitle="Pakistan Historical Map"
          mapDescription="Markers represent verified earthquakes located within Pakistan."
          locationLocked
          locationValue="Pakistan"
          metricLabels={{ countries: 'Regions' }}
        />
      )}
    </section>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
  activeClasses,
  idleClasses,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  activeClasses: string;
  idleClasses: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-serif text-sm font-bold tracking-wide transition-all duration-200 ${
        active ? `${activeClasses} scale-[1.02]` : `${idleClasses} scale-100`
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
