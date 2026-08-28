import { cloneElement, type FormEvent, type ReactElement } from 'react';
import { Button, Input, InputNumber, Select } from 'antd';
import type { AnalyticsFilters } from '@/features/dashboard/analytics/types';

type Props = { draft: AnalyticsFilters; setDraft: (patch: Partial<AnalyticsFilters>) => void; onApply: () => void; onReset: () => void; isLoading: boolean; showLocation: boolean };
const years = Array.from({ length: new Date().getUTCFullYear() - 1975 + 1 }, (_, index) => new Date().getUTCFullYear() - index);
const currentYear = String(new Date().getUTCFullYear());
const endDate = (year: string) => year === currentYear ? new Date().toISOString().slice(0, 10) : `${year}-12-31`;

/** Holds draft analytics filters locally until the user explicitly applies a new request. */
export default function HistoricalAnalyticsControls({ draft, setDraft, onApply, onReset, isLoading, showLocation }: Props) {
  const startYear = draft.startDate.slice(0, 4), endYear = draft.endDate.slice(0, 4);
  const setStart = (year: string) => setDraft({ startDate: `${year}-01-01` });
  const setEnd = (year: string) => setDraft({ endDate: endDate(year) });
  return <form onSubmit={(event: FormEvent) => { event.preventDefault(); onApply(); }} className="geo-filter-panel geo-analytics-filters">
    <div className="historical-analytics-controls__header"><p className="historical-analytics-controls__title">Historical filters</p><span className="historical-analytics-controls__badge">M{draft.minMagnitude}+ selected</span></div>
    <div className={`historical-analytics-controls-grid ${showLocation ? 'historical-analytics-controls-grid--location' : 'historical-analytics-controls-grid--compact'}`}>
      <Field label="Start Year"><Select value={startYear} onChange={setStart} options={years.map((year) => ({ value: String(year), label: String(year) }))} /></Field>
      <Field label="End Year"><Select value={endYear} onChange={setEnd} options={years.map((year) => ({ value: String(year), label: String(year) }))} /></Field>
      <Field label="Minimum Magnitude"><InputNumber min={0} max={10} step={0.1} value={draft.minMagnitude} onChange={(value) => setDraft({ minMagnitude: value ?? 0 })} /></Field>
      {showLocation && <Field label="Location"><Input value={draft.location} placeholder="Country, city, or region" onChange={(event) => setDraft({ location: event.target.value })} /></Field>}
      <div className="historical-analytics-actions"><Button htmlType="submit" disabled={isLoading} className="historical-analytics-search">Search</Button><Button htmlType="button" onClick={onReset} className="historical-analytics-reset">Reset</Button></div>
    </div>
  </form>;
}

/** Renders or coordinates field for this frontend module. */
function Field({ label, children }: { label: string; children: ReactElement<{ className?: string }> }) {
  return <label className="historical-analytics-field"><span>{label}</span>{cloneElement(children, { className: 'historical-analytics-control' })}</label>;
}
