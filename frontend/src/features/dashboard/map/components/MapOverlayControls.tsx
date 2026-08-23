import { Flame, Layers, Waves } from 'lucide-react';

/** Controls optional heat/plate overlays while leaving the earthquake marker dataset unchanged. */
export function MapOverlayControls({ heat, plates, onHeat, onPlates }: { heat: boolean; plates: boolean; onHeat: (value: boolean) => void; onPlates: (value: boolean) => void; }) {
  return <Section label="Overlays" icon={<Layers className="h-3.5 w-3.5 text-emerald-400" />} tint="from-emerald-500/10 to-cyan-500/10" border="border-emerald-400/20"><div className="grid grid-cols-2 gap-2"><Toggle label="Heat" icon={<Flame className="h-4 w-4" />} accent="from-orange-500 via-red-500 to-rose-500" checked={heat} onChange={onHeat} /><Toggle label="Plates" icon={<Waves className="h-4 w-4" />} accent="from-cyan-400 via-teal-500 to-emerald-500" checked={plates} onChange={onPlates} /></div></Section>;
}
/** Renders or coordinates section for this frontend module. */
function Section({ label, icon, trailing, tint, border, className, children }: { label?: string; icon?: React.ReactNode; trailing?: React.ReactNode; tint?: string; border?: string; className?: string; children: React.ReactNode; }) { return <div className={`rounded-2xl border ${border ?? 'border-white/10'} bg-gradient-to-br ${tint ?? 'from-white/5 to-white/0'} p-3 ${className ?? ''}`}>{label && <div className="mb-2 flex items-center justify-between"><span className="flex items-center gap-1.5 font-serif text-[11px] font-bold uppercase tracking-wide text-slate-300">{icon}{label}</span>{trailing}</div>}{children}</div>; }
/** Renders or coordinates toggle for this frontend module. */
function Toggle({ label, icon, accent, checked, onChange }: { label: string; icon: React.ReactNode; accent: string; checked: boolean; onChange: (value: boolean) => void; }) { return <label className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl px-2 py-2.5 text-xs font-bold transition-all ${checked ? `bg-gradient-to-r ${accent} text-white shadow-lg` : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>{icon}{label}<input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" /></label>; }


