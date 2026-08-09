import { Layers } from 'lucide-react';
import { MapTileKey, mapTiles } from '../../../../components/map/mapStyles';

export default function MapStyleControl({ tile, onTile }: { tile: MapTileKey; onTile: (value: MapTileKey) => void; }) {
  return <Section label="Map style" icon={<Layers className="h-3.5 w-3.5 text-violet-400" />} tint="from-violet-500/10 to-indigo-500/10" border="border-violet-400/20"><select value={tile} onChange={(e) => onTile(e.target.value as MapTileKey)} className="w-full rounded-2xl border border-violet-400/20 bg-slate-950/60 px-3 py-2.5 text-sm text-white transition-colors focus:border-violet-400">{Object.entries(mapTiles).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></Section>;
}
function Section({ label, icon, trailing, tint, border, className, children }: { label?: string; icon?: React.ReactNode; trailing?: React.ReactNode; tint?: string; border?: string; className?: string; children: React.ReactNode; }) { return <div className={`rounded-2xl border ${border ?? 'border-white/10'} bg-gradient-to-br ${tint ?? 'from-white/5 to-white/0'} p-3 ${className ?? ''}`}>{label && <div className="mb-2 flex items-center justify-between"><span className="flex items-center gap-1.5 font-serif text-[11px] font-bold uppercase tracking-wide text-slate-300">{icon}{label}</span>{trailing}</div>}{children}</div>; }


