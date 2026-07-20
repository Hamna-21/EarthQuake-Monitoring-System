import { Search, SlidersHorizontal, Layers, Flame, Waves, LocateFixed, Loader2, X, MapPin, Sparkles } from 'lucide-react';
import { MapTileKey, mapTiles } from '../../../../components/dashboard/mapStyles';
import { Panel, PanelHeader } from '../../../../components/dashboard/panelstat';

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
}

export default function MapControlPanel(props: MapControlPanelProps) {
  return (
    <Panel>
      <PanelHeader icon={<SlidersHorizontal className="h-3.5 w-3.5 text-white" />} accent="from-cyan-400 via-blue-500 to-violet-500" title="Map Controls" />

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Section
          label="Find a location"
          icon={<Search className="h-3.5 w-3.5 text-cyan-400" />}
          tint="from-cyan-500/10 to-fuchsia-500/10"
          border="border-cyan-400/20"
          className="xl:col-span-2"
        >
          <div className="flex gap-2">
            <label className="relative block flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
              <input
                value={props.query}
                onChange={(e) => props.onQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') props.onSearchSubmit(); }}
                placeholder="Search a place..."
                className="w-full rounded-2xl border border-cyan-400/20 bg-slate-950/60 py-2.5 pl-10 pr-8 text-sm text-white outline-none placeholder:text-slate-500 transition-colors focus:border-cyan-400 focus:bg-slate-950/90"
              />
              {props.hasSearchPin && (
                <button
                  onClick={props.onClearSearchPin}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-rose-400"
                  title="Clear search pin"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <button
              onClick={props.onSearchSubmit}
              disabled={props.isSearching || !props.query.trim()}
              className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-fuchsia-900/30 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              title="Fly to place"
            >
              {props.isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </button>
            <button
              onClick={props.onLocateMe}
              disabled={props.isLocating}
              className="flex flex-shrink-0 items-center gap-1.5 rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-3 text-xs font-bold text-cyan-200 transition-colors hover:from-cyan-500/30 hover:to-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {props.isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            </button>
          </div>
          {props.searchError && <InlineError>{props.searchError}</InlineError>}
          {props.locateError && <InlineError>{props.locateError}</InlineError>}
          {props.hasSearchPin && (
            <div className="mt-2 flex items-center gap-1.5 rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-2.5 py-1.5 text-[11px] font-bold text-fuchsia-200">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              Search pin active
            </div>
          )}
        </Section>

        <Section
          label="Min magnitude"
          icon={<Sparkles className="h-3.5 w-3.5 text-amber-400" />}
          tint="from-amber-500/10 to-red-500/10"
          border="border-amber-400/20"
          trailing={
            <span className="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 px-2.5 py-0.5 font-mono text-xs font-black text-white shadow shadow-orange-900/30">
              {props.minMag.toFixed(1)}
            </span>
          }
        >
          <input
            type="range"
            min="0"
            max="9"
            step="0.1"
            value={props.minMag}
            onChange={(e) => props.onMinMag(Number(e.target.value))}
            className="block w-full accent-orange-500"
          />
        </Section>

        <Section label="Map style" icon={<Layers className="h-3.5 w-3.5 text-violet-400" />} tint="from-violet-500/10 to-indigo-500/10" border="border-violet-400/20">
          <select
            value={props.tile}
            onChange={(e) => props.onTile(e.target.value as MapTileKey)}
            className="w-full rounded-2xl border border-violet-400/20 bg-slate-950/60 px-3 py-2.5 text-sm text-white transition-colors focus:border-violet-400"
          >
            {Object.entries(mapTiles).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </Section>

        <Section label="Overlays" icon={<Layers className="h-3.5 w-3.5 text-emerald-400" />} tint="from-emerald-500/10 to-cyan-500/10" border="border-emerald-400/20">
          <div className="grid grid-cols-2 gap-2">
            <Toggle label="Heat" icon={<Flame className="h-4 w-4" />} accent="from-orange-500 via-red-500 to-rose-500" checked={props.heat} onChange={props.onHeat} />
            <Toggle label="Plates" icon={<Waves className="h-4 w-4" />} accent="from-cyan-400 via-teal-500 to-emerald-500" checked={props.plates} onChange={props.onPlates} />
          </div>
        </Section>
      </div>
    </Panel>
  );
}

function Section({
  label, icon, trailing, tint, border, className, children,
}: {
  label?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  tint?: string;
  border?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border ${border ?? 'border-white/10'} bg-gradient-to-br ${tint ?? 'from-white/5 to-white/0'} p-3 ${className ?? ''}`}>
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wide text-slate-300">
            {icon}
            {label}
          </span>
          {trailing}
        </div>
      )}
      {children}
    </div>
  );
}

function InlineError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-[11px] font-bold text-rose-400">{children}</p>;
}

function Toggle({ label, icon, accent, checked, onChange }: { label: string; icon: React.ReactNode; accent: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold transition-all ${checked ? `bg-gradient-to-r ${accent} text-white shadow-lg` : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
      {icon}{label}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
    </label>
  );
}