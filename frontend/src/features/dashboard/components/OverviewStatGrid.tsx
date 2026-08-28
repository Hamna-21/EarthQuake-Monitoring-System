import { AlertTriangle, Globe2, MapPin, RadioTower, TrendingUp, Waves } from 'lucide-react';
import { Col, Row } from 'antd';
import { Earthquake } from '@/types';
import { statsFor } from '@/features/dashboard/utils/data';
import OverviewStatCard from '@/features/dashboard/components/OverviewStatCard';
import { spark, toneStyles, topActiveCountry } from '@/features/dashboard/components/overviewHelpers';

type CardTone = keyof typeof toneStyles;

/** Renders or coordinates overview stat grid for this frontend module. */
export default function OverviewStatGrid({ earthquakes }: { earthquakes: Earthquake[] }) {
  const stats = statsFor(earthquakes);
  const topCountry = topActiveCountry(earthquakes);
  const cards = [
    ['Loaded Events', 'current live dataset', earthquakes.length, Globe2, 'from-cyan-500 to-blue-500', 'shadow-cyan-500/20', 'neutral', 'Live', 3],
    ['Average Magnitude', 'across loaded activity', stats.avgMag.toFixed(1), TrendingUp, 'from-emerald-500 to-teal-400', 'shadow-emerald-500/20', 'positive', 'Stable', 5],
    ['Strongest Event', 'peak magnitude recorded', stats.strongest.toFixed(1), AlertTriangle, 'from-orange-500 to-red-600', 'shadow-red-500/20', 'alert', 'Peak', 8],
    ['Most Active Ground', 'by earthquake frequency', topCountry, MapPin, 'from-fuchsia-500 to-violet-500', 'shadow-fuchsia-500/20', 'neutral', 'Region', 2],
    ['Tsunami Warnings', 'currently in effect', stats.tsunami, Waves, 'from-sky-500 to-cyan-400', 'shadow-sky-500/20', stats.tsunami > 0 ? 'alert' : 'positive', stats.tsunami > 0 ? 'Active' : 'Clear', 6],
    ['High-Risk Regions', 'flagged for elevated activity', stats.red, RadioTower, 'from-rose-700 to-red-500', 'shadow-rose-600/20', stats.red > 0 ? 'alert' : 'positive', stats.red > 0 ? 'Watching' : 'Quiet', 9],
  ] as const;

  return (
    <section>
      <div className="overview-section-heading">
        <div>
          <p className="overview-section-heading__eyebrow">Situation Room</p>
          <h2>Global Pulse, at a Glance</h2>
        </div>
      </div>
      <Row className="overview-stat-grid" gutter={[12, 12]}>
        {cards.map(([label, caption, value, icon, gradient, glow, tone, tag, seed]) => (
          <Col key={label} xs={24} md={12} xl={8}><OverviewStatCard label={label} caption={caption} value={value} icon={icon} gradient={gradient} glow={glow} toneChip={toneStyles[tone as CardTone].chip} tag={tag} bars={spark(seed)} /></Col>
        ))}
      </Row>
    </section>
  );
}
/** Arranges the overview metrics into the responsive dashboard stat grid. */
