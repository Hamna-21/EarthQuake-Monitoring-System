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

export default function AlertRuleForm(props: AlertRuleFormProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl">
      <h3 className="flex items-center gap-2 text-xl font-black text-white">
        <BellPlus className="h-5 w-5 text-cyan-200" /> New Rule
      </h3>
      <label className="mt-5 block text-sm font-bold text-slate-300">
        <span className="flex items-center gap-1.5"><Tags className="h-3.5 w-3.5" /> Rule name</span>
        <input value={props.name} onChange={(e) => props.setName(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-white outline-none focus:border-cyan-300" placeholder="Pacific Rim Watch" />
      </label>
      <Slider label="Magnitude exceeds" value={props.minMag.toFixed(1)} icon={<Gauge className="h-3.5 w-3.5" />}>
        <input type="range" min="0" max="9" step="0.1" value={props.minMag} onChange={(e) => props.setMinMag(Number(e.target.value))} className="mt-3 w-full accent-orange-500" />
      </Slider>
      <Slider label="Within radius" value={`${props.radiusKm} km`} icon={<Radar className="h-3.5 w-3.5" />}>
        <input type="range" min="50" max="2000" step="50" value={props.radiusKm} onChange={(e) => props.setRadiusKm(Number(e.target.value))} className="mt-3 w-full accent-cyan-500" />
      </Slider>
      <label className="mt-4 flex cursor-pointer items-center justify-between rounded-2xl border border-cyan-200/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-50">
        <span className="flex items-center gap-2"><Waves className="h-4 w-4" /> Tsunami warnings only</span>
        <input type="checkbox" checked={props.tsunamiOnly} onChange={(e) => props.setTsunamiOnly(e.target.checked)} className="h-4 w-4 accent-cyan-400" />
      </label>
      <button onClick={props.addRule} disabled={!props.name.trim()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-700/25 disabled:opacity-50">
        <BellPlus className="h-4 w-4" /> Add Rule
      </button>
    </div>
  );
}

function Slider({ label, value, icon, children }: { label: string; value: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="mt-4 block text-sm font-bold text-slate-300">
      <span className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">{icon} {label}</span>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white">{value}</span>
      </span>
      {children}
    </label>
  );
}


