import { Empty } from 'antd';

/** Presents the empty result state for Overview search without changing search behavior. */
export default function OverviewEmptyState() {
  return <div className="overview-empty-state"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} /><h2>No matching earthquakes found</h2><p>Try a country, location, magnitude, alert level, status, or event ID.</p></div>;
}
