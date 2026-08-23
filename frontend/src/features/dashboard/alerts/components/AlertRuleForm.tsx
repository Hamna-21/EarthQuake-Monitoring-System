// AlertRuleForm.tsx
import { BellPlus, Gauge, Radar, Tags, Waves } from 'lucide-react';

interface AlertRuleFormProps {
  name: string;
  setName: (value: string) => void;
  minMag: number;
  setMinMag: (value: number) => void;
  radiusKm: number;
  setRadiusKm: (value: number) => void;
  tsunamiOnly: boolean;
  setTsunamiOnly: (value: boolean) => void;
  addRule: () => void;
}

/** Renders or coordinates alert rule form for this frontend module. */
export default function AlertRuleForm(props: AlertRuleFormProps) {
  return (
    <div className="aspect-square flex flex-col rounded-lg border border-white/10 bg-white/[0.05] p-2.5 shadow-sm backdrop-blur-md">
      <h3 className="flex items-center gap-1 text-xs font-black text-white">
        <BellPlus className="h-3 w-3 text-cyan-200" /> New Rule
      </h3>
      <input
        value={props.name}
        onChange={(e) => props.setName(e.target.value)}
        className="mt-2 w-full rounded-md border border-white/10 bg-black/20 px-2 py-1 text-[10px] text-white outline-none focus:border-cyan-300"
        placeholder="Rule name"
      />
      <Slider label="Mag >" value={props.minMag.toFixed(1)} icon={<Gauge className="h-2.5 w-2.5" />}>
        <input type="range" min="0" max="9" step="0.1" value={props.minMag} onChange={(e) => props.setMinMag(Number(e.target.value))} className="mt-1 w-full accent-orange-500" />
      </Slider>
      <Slider label="Radius" value={`${props.radiusKm}km`} icon={<Radar className="h-2.5 w-2.5" />}>
        <input type="range" min="50" max="2000" step="50" value={props.radiusKm} onChange={(e) => props.setRadiusKm(Number(e.target.value))} className="mt-1 w-full accent-cyan-500" />
      </Slider>
      <label className="mt-2 flex cursor-pointer items-center justify-between rounded-md border border-cyan-200/20 bg-cyan-300/10 px-2 py-1 text-[10px] font-bold text-cyan-50">
        <span className="flex items-center gap-1"><Waves className="h-2.5 w-2.5" /> Tsunami only</span>
        <input type="checkbox" checked={props.tsunamiOnly} onChange={(e) => props.setTsunamiOnly(e.target.checked)} className="h-3 w-3 accent-cyan-400" />
      </label>
      <button
        onClick={props.addRule}
        disabled={!props.name.trim()}
        className="mt-auto flex w-full items-center justify-center gap-1 rounded-md bg-gradient-to-r from-red-600 to-orange-500 px-2 py-1.5 text-[10px] font-black text-white shadow-sm disabled:opacity-50"
      >
        <BellPlus className="h-2.5 w-2.5" /> Add Rule
      </button>
    </div>
  );
}

/** Renders or coordinates slider for this frontend module. */
function Slider({ label, value, icon, children }: { label: string; value: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="mt-1.5 block text-[10px] font-bold text-slate-300">
      <span className="flex items-center justify-between">
        <span className="flex items-center gap-1">{icon} {label}</span>
        <span className="rounded-full bg-white/10 px-1 py-0.5 text-[9px] text-white">{value}</span>
      </span>
      {children}
    </label>
  );
}
