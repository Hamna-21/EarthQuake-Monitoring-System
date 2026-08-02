import { DashboardProps } from '../../../components/dashboard/types';
import HistoryPageShell from './components/HistoryPageShell';

export default function PakistanHistoryPage(props: DashboardProps) {
  return (
    <HistoryPageShell
      {...props}
      scope="pakistan"
      label="Pakistan Seismic History"
      title="Explore verified earthquakes across Pakistan"
      description="Search historical seismic activity using dates, magnitude, and verified geographic records."
      mapTitle="Pakistan Earthquake Map"
      mapDescription="Markers represent verified earthquakes located within Pakistan."
      locationLocked
      locationValue="Pakistan"
      metricLabels={{ countries: 'Regions' }}
    />
  );
}
