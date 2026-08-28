import { Download, Search } from 'lucide-react';
import { Button, Input, Select as AntSelect } from 'antd';
import { EventFilters, SortState } from '@/features/dashboard/types';

const inputCls = 'dashboard-feed-filters__control';

/** Renders or coordinates feed filters for this frontend module. */
export default function FeedFilters({ filters, sort, onFilter, onSort, onExport, disabled }: { filters: EventFilters; sort: SortState; onFilter: (patch: Partial<EventFilters>) => void; onSort: (sort: SortState) => void; onExport: () => void; disabled: boolean }) {
  return (
    <section className="dashboard-feed-filters">
      <div className="dashboard-feed-filters__grid">
        <Field label="Search">
          <div className="relative">
            <Input prefix={<Search className="h-3.5 w-3.5 text-slate-400" />} value={filters.query} onChange={(e) => onFilter({ query: e.target.value })} placeholder="Search location" className={`${inputCls} geo-antd-control`} />
          </div>
        </Field>
        <Field label="Alert"><Select value={filters.alert} onChange={(v) => onFilter({ alert: v })} options={['all', 'green', 'yellow', 'orange', 'red', 'none']} /></Field>
        <Field label="Tsunami"><Select value={filters.tsunami} onChange={(v) => onFilter({ tsunami: v })} options={['all', 'yes', 'no']} /></Field>
        <Field label="Sort By"><Select value={sort.key} onChange={(v) => onSort({ ...sort, key: v as SortState['key'] })} options={['time', 'magnitude', 'depth', 'place']} /></Field>
        <Field label="Export">
          <Button onClick={onExport} disabled={disabled} className="dashboard-feed-filters__export">
            <Download className="h-3.5 w-3.5" />CSV
          </Button>
        </Field>
      </div>
    </section>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="dashboard-feed-filters__field">
    <label className="dashboard-feed-filters__label">{label}</label>
    {children}
  </div>
);

const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <AntSelect value={value} onChange={onChange} className={`${inputCls} geo-antd-control`} options={options.map((o) => ({ value: o, label: o }))} />
);
/** Provides filters used to narrow the live earthquake feed. */
