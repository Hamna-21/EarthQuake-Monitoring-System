import { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, Statistic } from 'antd';

/** Renders or coordinates overview stat card for this frontend module. */
function OverviewStatCard({ label, caption, value, icon: Icon, gradient, glow, toneChip, tag, bars }: { label: string; caption: string; value: string | number; icon: LucideIcon; gradient: string; glow: string; toneChip: string; tag: string; bars: number[]; }) {
  return (
    <Card bordered={false} className={`overview-stat-card geo-kpi-card geo-card-hover group ${glow}`} styles={{ body: { padding: 0, height: '100%' } }}>
      <div className={`overview-stat-card__glow bg-gradient-to-br ${gradient}`} />
      <div className="overview-stat-card__header">
        <span className={`overview-stat-card__icon bg-gradient-to-br ${gradient}`}><Icon /></span>
        <span className={`overview-stat-card__tag ${toneChip}`}>{tag}</span>
      </div>
      <p className="overview-stat-card__label">{label}</p>
      <Statistic className="overview-statistic" value={value} />
      <p className="overview-stat-card__caption">{caption}</p>
      <div className="overview-stat-card__bars">{bars.map((height, index) => <span key={index} className={`overview-stat-card__bar bg-gradient-to-t ${gradient}`} style={{ height: `${height}%` }} />)}</div>
    </Card>
  );
}

export default memo(OverviewStatCard);
/** Displays one overview statistic with its supporting label and icon. */
