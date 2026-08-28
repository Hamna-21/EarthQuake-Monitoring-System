import type { CSSProperties } from 'react';
import { memo } from 'react';
import { ArrowUpRight, Compass, Clock3 } from 'lucide-react';
import { Button, Card } from 'antd';
import { Earthquake } from '@/types';
import { markerColor } from '@/features/dashboard/map/components/mapStyles';
import { countryOf, fmtDate } from '@/features/dashboard/utils/data';

/** Renders or coordinates live feed card for this frontend module. */
function LiveFeedCard({
  event,
  onDetails,
  highlighted = false,
}: {
  event: Earthquake;
  onDetails: (event: Earthquake) => void;
  highlighted?: boolean;
}) {
  const color = markerColor(event.magnitude);

  return (
    <Card
      bordered={false}
      className={`dashboard-feed-card ${highlighted ? 'dashboard-feed-card--highlighted' : ''}`}
      styles={{ body: { padding: 0 } }}
      style={{
        '--feed-accent': color,
        '--feed-accent-border': `${color}55`,
        '--feed-accent-bg': `${color}18`,
        '--feed-accent-glow': `${color}15`,
        '--feed-accent-button-bg': `${color}10`,
        '--feed-accent-shadow': `${color}25`,
        boxShadow: highlighted
          ? `0 0 18px ${color}25`
          : `0 8px 24px rgba(0,0,0,0.15)`,
      } as CSSProperties}
    >
      {/* subtle magnitude accent */}
      <div
        className="dashboard-feed-card__accent"
        style={{ backgroundColor: color }}
      />

      <div className="dashboard-feed-card__body">
        {/* MAGNITUDE */}
        <div
          className="dashboard-feed-card__magnitude"
          style={{
            color,
            borderColor: `${color}55`,
            backgroundColor: `${color}18`,
            boxShadow: `0 0 14px ${color}15`,
          }}
        >
          {event.magnitude.toFixed(1)}
        </div>

        {/* CONTENT */}
        <div className="dashboard-feed-card__content">
          <p className="dashboard-feed-card__place">
            <Compass
              className="dashboard-feed-card__place-icon"
              style={{ color }}
            />

            <span className="dashboard-feed-card__place-text">
              {countryOf(event.place)}
            </span>
          </p>

          <p className="dashboard-feed-card__time">
            <Clock3 className="dashboard-feed-card__time-icon" />

            {fmtDate(event.time, 'UTC')}
          </p>

          {/* BUTTON */}
          <Button
            onClick={() => onDetails(event)}
            className="dashboard-feed-card__button"
            style={{
              color,
              borderColor: `${color}40`,
              backgroundColor: `${color}10`,
            }}
          >
            View details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default memo(LiveFeedCard);
