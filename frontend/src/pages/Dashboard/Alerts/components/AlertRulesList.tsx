import { BellRing, Trash2 } from 'lucide-react';
import { Rule, severityOf } from '../alertRules';

interface AlertRulesListProps {
  rules: Rule[];
  removeRule: (id: number) => void;
}

export default function AlertRulesList({ rules, removeRule }: AlertRulesListProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl">
      <h3 className="flex items-center gap-2 text-xl font-black text-white">
        <BellRing className="h-5 w-5 text-cyan-200" /> Monitoring Rules
      </h3>
      <div className="mt-4 space-y-3">
        {rules.length ? rules.map((rule) => {
          const severity = severityOf(rule.minMag);
          return (
            <div key={rule.id} className={`rounded-2xl border ${severity.border} ${severity.tint} p-4`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <b className="text-white">{rule.name}</b>
                  <p className="mt-1 text-sm text-slate-300">
                    M {rule.minMag.toFixed(1)}+ within {rule.radiusKm} km{rule.tsunamiOnly ? ' · tsunami only' : ''}
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-cyan-100">
                    {severity.label}
                  </span>
                </div>
                <button onClick={() => removeRule(rule.id)} className="rounded-2xl border border-white/10 bg-white/10 p-2 text-red-200 hover:bg-red-500/20" aria-label={`Delete rule ${rule.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        }) : (
          <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm font-semibold text-slate-400">
            No rules created yet. Build one to start monitoring.
          </p>
        )}
      </div>
    </div>
  );
}


