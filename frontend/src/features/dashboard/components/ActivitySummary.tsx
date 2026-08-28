import { memo, useMemo } from 'react';
import { Earthquake } from '@/types';

const tiers = [
  { max: 10, label: 'LOW', word: 'Calm', ring: '#10b981', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', glow: 'rgba(16,185,129,0.18)' },
  { max: 25, label: 'MODERATE', word: 'Watchful', ring: '#f59e0b', chip: 'bg-amber-50 text-amber-700 border-amber-200', glow: 'rgba(245,158,11,0.18)' },
  { max: 45, label: 'HIGH', word: 'Elevated', ring: '#f97316', chip: 'bg-orange-50 text-orange-700 border-orange-200', glow: 'rgba(249,115,22,0.18)' },
  { max: 101, label: 'EXTREME', word: 'Critical', ring: '#dc2626', chip: 'bg-red-50 text-red-700 border-red-200', glow: 'rgba(220,38,38,0.2)' },
];

/** Summarizes the current risk level and highlights high-magnitude events. */
function ActivitySummary({ earthquakes }: { earthquakes: Earthquake[] }) {
  const { highRisk, score, tier } = useMemo(() => {
    const highRiskCount = earthquakes.filter((event) => event.magnitude >= 5 || event.alert).length;
    const eventTotal = Math.max(earthquakes.length, 1);
    const riskScore = Math.min(100, Math.round((highRiskCount / eventTotal) * 100));
    return { highRisk: highRiskCount, score: riskScore, tier: tiers.find((item) => riskScore < item.max)! };
  }, [earthquakes]);

  return (
    <article className="activity-summary">
      <div className="activity-summary__glow activity-summary__glow--top" style={{ background: tier.glow }} />
      <div className="activity-summary__glow activity-summary__glow--bottom" style={{ background: tier.glow }} />
      <div className="activity-summary__content">
        <p className="activity-summary__risk-label" style={{ color: tier.ring }}>
          <span className="activity-summary__risk-dot" style={{ backgroundColor: tier.ring }} />
          Risk Index
          <span className={`activity-summary__risk-chip activity-summary__risk-chip--${tier.label.toLowerCase()}`}>{tier.word}</span>
        </p>
        <div className="activity-summary__ring-wrap">
          <div className="activity-summary__ring" style={{ background: `conic-gradient(${tier.ring} ${score}%, rgba(15,23,42,0.08) 0)`, boxShadow: `0 0 28px ${tier.glow}` }}>
            <div className="activity-summary__ring-inner"><strong>{score}</strong><span>of 100</span></div>
          </div>
        </div>
        <h2 className="activity-summary__tier" style={{ color: tier.ring }}>{tier.label}</h2>
        <p className="activity-summary__copy"><strong>{highRisk}</strong> of <strong>{earthquakes.length}</strong> events flagged as high-magnitude or alerted.</p>
        <div className="activity-summary__scale">
          <div className="activity-summary__scale-bar"><div className="activity-summary__scale-segment activity-summary__scale-segment--calm" /><div className="activity-summary__scale-segment activity-summary__scale-segment--moderate" /><div className="activity-summary__scale-segment activity-summary__scale-segment--high" /><div className="activity-summary__scale-segment activity-summary__scale-segment--extreme" /></div>
          <div className="activity-summary__scale-marker" style={{ marginLeft: `calc(${score}% - 8px)`, backgroundColor: tier.ring, boxShadow: `0 0 8px 2px ${tier.glow}` }} />
          <div className="activity-summary__scale-labels"><span>Calm</span><span>Critical</span></div>
        </div>
      </div>
    </article>
  );
}

export default memo(ActivitySummary);
