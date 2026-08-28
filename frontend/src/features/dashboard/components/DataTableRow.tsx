import { Earthquake } from '@/types';
import { memo } from 'react';
import { alertStyle, depthStyle } from '@/features/dashboard/utils/colors';
import { countryOf, fmtDate } from '@/features/dashboard/utils/data';
import Badge from '@/features/dashboard/components/Badge';
import { statusTone, tierAccent } from '@/features/dashboard/constants';

interface DataTableRowProps {
  event: Earthquake;
  index: number;
  onSelect: (event: Earthquake) => void;
  highlighted?: boolean;
}

/** Renders or coordinates data table row for this frontend module. */
function DataTableRow({ event, index, onSelect, highlighted = false }: DataTableRowProps) {
  const accent = tierAccent(event.magnitude);

  return (
    <tr
      onClick={() => onSelect(event)}
      className={`dashboard-data-row ${highlighted ? 'dashboard-data-row--highlighted' : index % 2 ? 'dashboard-data-row--odd' : 'dashboard-data-row--even'}`}
    >
      <td className={`dashboard-data-cell dashboard-data-cell--accent ${accent.border}`}>
        <span className={`dashboard-data-magnitude ${accent.chip}`}>
          <span className={`dashboard-data-magnitude__value ${accent.text}`}>{event.magnitude.toFixed(1)}</span>
          <span className="dashboard-data-magnitude__label">mag</span>
        </span>
      </td>
      <td className="dashboard-data-cell"><p className="dashboard-data-place">{event.place}</p></td>
      <td className="dashboard-data-cell">
        <span className="dashboard-data-country">
          {countryOf(event.place)}
        </span>
      </td>
      <td className="dashboard-data-cell"><Badge className={depthStyle(event.depth)}>{event.depth.toFixed(1)} km</Badge></td>
      <td className="dashboard-data-cell"><span className="dashboard-data-time">{fmtDate(event.time, 'UTC')}</span></td>
      <td className="dashboard-data-cell"><Badge className={alertStyle(event.alert)}>{event.alert ?? 'None'}</Badge></td>
      <td className="dashboard-data-cell">
        <Badge className={event.tsunami ? 'border-fuchsia-600 bg-fuchsia-100 text-fuchsia-800' : 'border-teal-600 bg-teal-100 text-teal-800'}>
          {event.tsunami ? 'Yes' : 'No'}
        </Badge>
      </td>
      <td className="dashboard-data-cell"><span className={`dashboard-data-status ${statusTone(event.status)}`}>{event.status}</span></td>
    </tr>
  );
}

export default memo(DataTableRow);


/** Renders one normalized earthquake record inside the data table. */
