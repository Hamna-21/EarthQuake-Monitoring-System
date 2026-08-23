import { fmt } from '@/features/dashboard/analytics/components/historicalChartData';

export const axis = { tick: { fill: '#dbeafe', fontSize: 12, fontWeight: 700 }, stroke: '#64748b' };
export const grid = { stroke: 'rgba(255,255,255,.14)', vertical: false };
export const margin = { top: 20, right: 24, left: 20, bottom: 42 };
export const labelStyle = { fill: '#fed7aa', fontSize: 13, fontWeight: 900 };

/** Formats the shared tooltip used by historical charts and safely handles empty series. */
export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/15 bg-slate-950/95 p-3 font-sans text-xs shadow-2xl">
      <p className="font-black text-white">{label}</p>
      {payload.map((item) => <p key={item.name} className="mt-1 font-bold text-orange-100">{item.name}: {fmt(Number(item.value ?? 0))}</p>)}
    </div>
  );
}
