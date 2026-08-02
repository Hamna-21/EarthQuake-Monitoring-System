import { Earthquake } from '../../../types';

export type Rule = {
  id: number;
  name: string;
  minMag: number;
  radiusKm: number;
  tsunamiOnly: boolean;
};

export const ALERT_RULES_KEY = 'geopulse-alert-rules';

export function loadRules(): Rule[] {
  try {
    const raw = localStorage.getItem(ALERT_RULES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function matchingRecords(earthquakes: Earthquake[], rules: Rule[]) {
  if (!rules.length) return [];
  return earthquakes
    .filter((event) => rules.some((rule) => event.magnitude >= rule.minMag && (!rule.tsunamiOnly || event.tsunami)))
    .slice(0, 10);
}

export function severityOf(minMag: number) {
  if (minMag >= 6) return { border: 'border-rose-400/30', tint: 'bg-rose-500/10', label: 'High Threshold' };
  if (minMag >= 5) return { border: 'border-amber-400/30', tint: 'bg-amber-500/10', label: 'Moderate Threshold' };
  return { border: 'border-emerald-400/30', tint: 'bg-emerald-500/10', label: 'Broad Threshold' };
}
