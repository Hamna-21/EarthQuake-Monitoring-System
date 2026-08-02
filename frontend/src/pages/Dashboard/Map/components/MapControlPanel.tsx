import { Maximize2, RotateCcw, Sparkles } from 'lucide-react';
import { MapTileKey } from '../../../../components/dashboard/mapStyles';
import { Panel } from '../../../../components/dashboard/panelstat';
import MapControlPanelHeader from './MapControlPanelHeader';
import { MapOverlayControls } from './MapOverlayControls';
import { MapSearchControl } from './MapSearchControl';
import MapStyleControl from './MapStyleControl';

interface MapControlPanelProps {
  query: string;
  minMag: number;
  tile: MapTileKey;
  onQuery: (value: string) => void;
  onMinMag: (value: number) => void;
  onTile: (value: MapTileKey) => void;
  heat: boolean;
  plates: boolean;
  onHeat: (value: boolean) => void;
  onPlates: (value: boolean) => void;
  onSearchSubmit: () => void;
  onClearSearchPin: () => void;
  hasSearchPin: boolean;
  isSearching: boolean;
  searchError: string | null;
  onLocateMe: () => void;
  isLocating: boolean;
  locateError: string | null;
  onResetMap: () => void;
  onFullscreenMap: () => void;
}

export default function MapControlPanel(props: MapControlPanelProps) {
  return (
    <Panel>
      <MapControlPanelHeader />
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MapSearchControl {...props} />
        <Section
          label="Min magnitude"
          icon={<Sparkles className="h-3.5 w-3.5 text-amber-400" />}
          tint="from-amber-500/10 to-red-500/10"
          border="border-amber-400/20"
          trailing={<span className="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 px-2.5 py-0.5 font-serif text-xs font-black text-white shadow shadow-orange-900/30">{props.minMag.toFixed(1)}</span>}
        >
          <input type="range" min="0" max="9" step="0.1" value={props.minMag} onChange={(e) => props.onMinMag(Number(e.target.value))} className="block w-full accent-orange-500" />
        </Section>
        <MapStyleControl tile={props.tile} onTile={props.onTile} />
        <MapOverlayControls heat={props.heat} plates={props.plates} onHeat={props.onHeat} onPlates={props.onPlates} />
        <Section
          label="Map view"
          icon={<RotateCcw className="h-3.5 w-3.5 text-cyan-300" />}
          tint="from-cyan-500/10 to-blue-500/10"
          border="border-cyan-400/20"
        >
          <div className="grid grid-cols-2 gap-2">
            <MapButton icon={<RotateCcw className="h-4 w-4" />} label="Reset" onClick={props.onResetMap} />
            <MapButton icon={<Maximize2 className="h-4 w-4" />} label="Full" onClick={props.onFullscreenMap} />
          </div>
        </Section>
      </div>
    </Panel>
  );
}

function Section({ label, icon, trailing, tint, border, className, children }: { label?: string; icon?: React.ReactNode; trailing?: React.ReactNode; tint?: string; border?: string; className?: string; children: React.ReactNode; }) {
  return <div className={`rounded-2xl border ${border ?? 'border-white/10'} bg-gradient-to-br ${tint ?? 'from-white/5 to-white/0'} p-3 ${className ?? ''}`}>{label && <div className="mb-2 flex items-center justify-between"><span className="flex items-center gap-1.5 font-serif text-[11px] font-bold uppercase tracking-wide text-slate-300">{icon}{label}</span>{trailing}</div>}{children}</div>;
}

function MapButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex items-center justify-center gap-1.5 rounded-2xl bg-white/8 px-2 py-2.5 font-serif text-xs font-black text-cyan-100 transition hover:bg-cyan-400/15">{icon}{label}</button>;
}


