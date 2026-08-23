import { DashboardProps } from '@/features/dashboard/types';
import HistoryPageShell from '@/features/dashboard/historical/components/HistoryPageShell';

/** Renders or coordinates history page for this frontend module. */
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
/** Hosts the historical records page, filters, map, and pagination state. */
