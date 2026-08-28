import { BellRing, Trash2 } from 'lucide-react';
import { Rule, severityOf } from '@/features/dashboard/alerts/constants';

interface AlertRulesListProps {
  rules: Rule[];
  removeRule: (id: number) => void;
}

/** Renders or coordinates alert rules list for this frontend module. */
export default function AlertRulesList({ rules, removeRule }: AlertRulesListProps) {
  return (
    <div className="alert-rules-list">
      <h3 className="alert-section-title alert-section-title--list">
        <BellRing className="alert-icon h-3.5 w-3.5" /> Monitoring Rules
      </h3>
      {rules.length ? (
        <div className="alert-rules-grid">
          {rules.map((rule) => {
            const severity = severityOf(rule.minMag);
            return (
              <div
                key={rule.id}
                title={rule.name}
                className={`alert-rule-card ${severity.border} ${severity.tint}`}
              >
                <div className="alert-rule-card__head">
                  <span className="alert-severity-label">
                    {severity.label}
                  </span>
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="alert-delete"
                    aria-label={`Delete rule ${rule.name}`}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                </div>
                <b className="alert-rule-name">{rule.name}</b>
                <p className="alert-rule-meta">
                  M{rule.minMag.toFixed(1)}+ · {rule.radiusKm}km{rule.tsunamiOnly ? ' · 🌊' : ''}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="alert-empty">
          No rules created yet.
        </p>
      )}
    </div>
  );
}
/** Renders saved alert rules and the controls used to manage them. */
