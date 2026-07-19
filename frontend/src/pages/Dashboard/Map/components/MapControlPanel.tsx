import { Search } from 'lucide-react';
import { MapTileKey, mapTiles } from '../../../../components/dashboard/mapStyles';

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
}

export default function MapControlPanel(props: MapControlPanelProps) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 text-white shadow-2xl backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Map Controls</p>
      <label className="relative mt-5 block">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
        <input value={props.query} onChange={(e) => props.onQuery(e.target.value)} placeholder="Country, city, magnitude" className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-300" />
      </label>
      <label className="mt-5 block text-sm font-bold text-slate-300">
        Minimum magnitude: <span className="text-white">{props.minMag.toFixed(1)}</span>
        <input type="range" min="0" max="9" step="0.1" value={props.minMag} onChange={(e) => props.onMinMag(Number(e.target.value))} className="mt-3 block w-full accent-red-500" />
      </label>
      <label className="mt-5 block text-sm font-bold text-slate-300">
        Map style
        <select value={props.tile} onChange={(e) => props.onTile(e.target.value as MapTileKey)} className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-white">
          {Object.entries(mapTiles).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
        </select>
      </label>
      <div className="mt-5 grid gap-2">
        <Toggle label="Heat map view" checked={props.heat} onChange={props.onHeat} />
        <Toggle label="Tectonic plates" checked={props.plates} onChange={props.onPlates} />
      </div>
    </aside>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-3 text-sm font-bold text-slate-200">{label}<input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-red-500" /></label>;
}
