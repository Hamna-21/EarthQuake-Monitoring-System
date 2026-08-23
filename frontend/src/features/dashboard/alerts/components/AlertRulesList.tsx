import { BellRing, Trash2 } from 'lucide-react';
import { Rule, severityOf } from '@/features/dashboard/alerts/constants';

interface AlertRulesListProps {
  rules: Rule[];
  removeRule: (id: number) => void;
}

/** Renders or coordinates alert rules list for this frontend module. */
export default function AlertRulesList({ rules, removeRule }: AlertRulesListProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.05] p-2.5 shadow-sm backdrop-blur-md">
      <h3 className="flex items-center gap-1.5 text-sm font-black text-white">
        <BellRing className="h-3.5 w-3.5 text-cyan-200" /> Monitoring Rules
      </h3>
      {rules.length ? (
        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {rules.map((rule) => {
            const severity = severityOf(rule.minMag);
            return (
              <div
                key={rule.id}
                title={rule.name}
                className={`group relative aspect-square w-full max-w-[120px] flex flex-col justify-between rounded-lg border ${severity.border} ${severity.tint} p-2`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-cyan-100">
                    {severity.label}
                  </span>
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="shrink-0 rounded-md border border-white/10 bg-black/30 p-1 text-red-200 hover:bg-red-500/30"
                    aria-label={`Delete rule ${rule.name}`}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                </div>
                <b className="line-clamp-2 text-[11px] leading-tight text-white">{rule.name}</b>
                <p className="text-[10px] text-slate-300">
                  M{rule.minMag.toFixed(1)}+ · {rule.radiusKm}km{rule.tsunamiOnly ? ' · 🌊' : ''}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-2.5 rounded-lg border border-dashed border-white/10 p-2.5 text-center text-[11px] font-semibold text-slate-400">
          No rules created yet.
        </p>
      )}
    </div>
  );
}
/** Renders saved alert rules and the controls used to manage them. */
