import type { ReactNode } from 'react';
import { Mountain, Moon, Satellite } from 'lucide-react';
import type { View } from './globeData';

const icons = { satellite: Satellite, terrain: Mountain, night: Moon };
const labels: Record<'satellite' | 'terrain' | 'night', string> = { satellite: 'Satellite', terrain: 'Terrain', night: 'Night' };

export default function GlobeViewControls({ view, onChange }: { view: View; onChange: (view: View) => void }) {
  return <div className="absolute right-3 top-3 z-20 flex max-w-[calc(100%-1.5rem)] overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80 p-1 shadow-xl backdrop-blur-xl">
    {(Object.keys(labels) as Array<'satellite' | 'terrain' | 'night'>).map((item) => <ViewButton key={item} active={view === item} label={labels[item]} icon={icons[item]} onClick={() => onChange(item)} />)}
  </div>;
}

function ViewButton({ active, label, icon: Icon, onClick }: { active: boolean; label: string; icon: (props: any) => ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} title={`${label} Earth view`} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-serif text-[11px] font-black transition sm:px-3 ${active ? 'bg-gradient-to-r from-red-600/85 to-orange-500/85 text-white shadow-[0_0_18px_rgba(249,115,22,.18)]' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon className="h-3.5 w-3.5" /><span>{label}</span></button>;
}
