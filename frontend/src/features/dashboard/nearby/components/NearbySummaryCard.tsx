/** Renders or coordinates nearby summary card for this frontend module. */
export default function NearbySummaryCard({ icon, label, value, gradient, border }: { icon: React.ReactNode; label: string; value: string | number; gradient: string; tint?: string; border: string }) {
  return (
    <article className={`nearby-summary-card ${border}`}>
      <div className="nearby-summary-card__header">
        <span className={`nearby-summary-card__icon bg-gradient-to-br ${gradient}`}>{icon}</span>
        <p className="nearby-summary-card__label">{label}</p>
      </div>
      <strong className="nearby-summary-card__value">{value}</strong>
    </article>
  );
}
/** Summarizes nearby earthquake counts and the selected search radius. */
