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
    <div className="alert-rule-form">
      <h3 className="alert-section-title">
        <BellPlus className="alert-icon h-3 w-3" /> New Rule
      </h3>
      <input
        value={props.name}
        onChange={(e) => props.setName(e.target.value)}
        className="alert-rule-input"
        placeholder="Rule name"
      />
      <Slider label="Mag >" value={props.minMag.toFixed(1)} icon={<Gauge className="h-2.5 w-2.5" />}>
        <input type="range" min="0" max="9" step="0.1" value={props.minMag} onChange={(e) => props.setMinMag(Number(e.target.value))} className="alert-slider__input accent-orange-500" />
      </Slider>
      <Slider label="Radius" value={`${props.radiusKm}km`} icon={<Radar className="h-2.5 w-2.5" />}>
        <input type="range" min="50" max="2000" step="50" value={props.radiusKm} onChange={(e) => props.setRadiusKm(Number(e.target.value))} className="alert-slider__input accent-cyan-500" />
      </Slider>
      <label className="alert-tsunami-toggle">
        <span className="alert-tsunami-toggle__label"><Waves className="h-2.5 w-2.5" /> Tsunami only</span>
        <input type="checkbox" checked={props.tsunamiOnly} onChange={(e) => props.setTsunamiOnly(e.target.checked)} className="h-3 w-3 accent-cyan-400" />
      </label>
      <button
        onClick={props.addRule}
        disabled={!props.name.trim()}
        className="alert-submit"
      >
        <BellPlus className="h-2.5 w-2.5" /> Add Rule
      </button>
    </div>
  );
}

/** Renders or coordinates slider for this frontend module. */
function Slider({ label, value, icon, children }: { label: string; value: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="alert-slider">
      <span className="alert-slider__head">
        <span className="alert-slider__label">{icon} {label}</span>
        <span className="alert-slider__value">{value}</span>
      </span>
      {children}
    </label>
  );
}
