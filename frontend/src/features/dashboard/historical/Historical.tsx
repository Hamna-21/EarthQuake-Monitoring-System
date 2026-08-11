import { DashboardProps } from '@/features/dashboard/types';
import HistoryPageShell from '@/features/dashboard/historical/components/HistoryPageShell';

export default function HistoryPage(props: DashboardProps) {
  return (
    <HistoryPageShell
      {...props}
      scope="global"
      label="Global Earthquake History"
      title="Explore historical earthquakes worldwide"
      description="Search global seismic events by date, magnitude, country, or region."
      mapTitle="Global Historical Map"
      mapDescription="Markers represent earthquake records matching the selected filters."
    />
  );
}
