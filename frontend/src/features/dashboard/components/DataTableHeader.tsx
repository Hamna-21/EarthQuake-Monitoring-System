import { tableColumns } from '@/features/dashboard/constants';
import { memo } from 'react';

/** Renders or coordinates data table header for this frontend module. */
function DataTableHeader() {
  return (
    <thead className="dashboard-data-table__head">
      <tr className="dashboard-data-table__head-row">
        {tableColumns.map(({ key, head, icon: Icon, tone }) => (
          <th key={key} className="dashboard-data-table__head-cell">
            <span className="dashboard-data-table__head-label">
              <Icon className={`h-3.5 w-3.5 ${tone}`} />
              {head}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default memo(DataTableHeader);
/** Renders the column headings for the reusable earthquake data table. */
