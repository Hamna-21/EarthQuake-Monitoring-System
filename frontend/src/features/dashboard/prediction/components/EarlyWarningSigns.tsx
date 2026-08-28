import { AlertTriangle, Sparkles, TrendingUp } from 'lucide-react';
import { facts, order, signs, tiers } from '../earlyWarningSigns.data';

/* Static sign configuration is owned by the prediction feature data module. */

export default function EarlyWarningSigns() {
  return (
    <section className="warning-signs">
      <div className="prediction-glow prediction-glow--orange" />
      <div className="prediction-glow prediction-glow--red" />

      <div className="warning-signs__heading">
        <span className="warning-signs__hero-icon">
          <AlertTriangle className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-serif text-lg font-black tracking-tight text-white">Signs before an earthquake</h2>
          <p className="warning-signs__subtitle">
            <Sparkles className="warning-signs__subtitle-icon" />
            Ranked by scientific reliability
          </p>
        </div>
      </div>

      <div className="warning-signs__facts">
        {facts.map((f) => (
          <div key={f.label} className={`warning-signs__fact warning-signs__fact--${f.tone}`}>
            <f.icon className="warning-signs__fact-icon" />
            <p className="warning-signs__fact-value">{f.value}</p>
            <p className="warning-signs__fact-label">{f.label}</p>
            <p className="warning-signs__fact-hint">{f.hint}</p>
          </div>
        ))}
      </div>

      <div className="warning-signs__tiers">
        {order.map((tier) => {
          const { label, hint, icon: Icon } = tiers[tier];
          const items = signs.filter((s) => s.tier === tier);
          return (
            <div key={tier} className={`warning-signs__tier warning-signs__tier--${tier}`}>
              <div className="warning-signs__tier-head">
                <span className="warning-signs__tier-icon">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="warning-signs__tier-label">{label}</span>
                <span className="warning-signs__badge">{items.length} signs</span>
                <span className="warning-signs__tier-dot" />
              </div>
            <p className="warning-signs__tier-hint">{hint}</p>
              <ul className="warning-signs__list">
                {items.map((s) => (
                  <li key={s.text} className="warning-signs__item">
                    <span className="warning-signs__item-dot" />
                    <span>{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <div className="warning-signs__forecast">
          <div className="warning-signs__forecast-head">
            <span className="warning-signs__forecast-icon">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <span className="warning-signs__forecast-label">Forecasting vs. prediction</span>
          </div>
          <p className="warning-signs__forecast-description">What science can and can't tell us in advance</p>
          <ul className="warning-signs__list">
            <li className="warning-signs__forecast-item">
              <span className="warning-signs__forecast-dot" />
              <span>Long-term forecasts give probabilities (e.g. "a major earthquake is likely in this region within 30 years"), not exact dates.</span>
            </li>
            <li className="warning-signs__forecast-item">
              <span className="warning-signs__forecast-dot" />
              <span>Early-warning systems detect an earthquake that has already started and race the shaking to nearby cities, buying seconds to act.</span>
            </li>
            <li className="warning-signs__forecast-item">
              <span className="warning-signs__forecast-dot" />
              <span>No current model can reliably state the exact day, location, and magnitude of a future earthquake in advance.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
