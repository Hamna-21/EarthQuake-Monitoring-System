import type { Earthquake } from '@/types';

function Empty() { return <div className="flex h-[220px] items-center justify-center rounded-2xl border border-white/10 bg-black/10 text-sm text-white/45">No matching earthquake data</div>; }

export function TimelineChart({ events }: { events: Earthquake[] }) {
  if (!events.length) return <Empty />;
  const counts = new Map<string, number>(); events.forEach((event) => { const key = new Date(event.time).toISOString().slice(0, 10); counts.set(key, (counts.get(key) ?? 0) + 1); });
  const rows = [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-7).map(([date, value]) => ({ date, label: new Date(date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' }), value }));
  if (!rows.length) return <Empty />;
  const width = 520; const height = 220; const left = 26; const right = 14; const top = 18; const bottom = 28; const chartW = width - left - right; const chartH = height - top - bottom; const max = Math.max(...rows.map((row) => row.value), 1);
  const points = rows.map((row, index) => ({ ...row, x: left + (index / Math.max(rows.length - 1, 1)) * chartW, y: top + chartH - (row.value / max) * chartH }));
  const line = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' '); const area = `${line} L ${points.at(-1)?.x} ${top + chartH} L ${points[0].x} ${top + chartH} Z`;
  return <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full"><defs><linearGradient id="timeline-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity=".35" /><stop offset="100%" stopColor="#f59e0b" stopOpacity=".03" /></linearGradient></defs>{[0, 1, 2].map((index) => <line key={index} x1={left} x2={width - right} y1={top + (chartH / 2) * index} y2={top + (chartH / 2) * index} stroke="rgba(255,255,255,.1)" />)}<path d={area} fill="url(#timeline-fill)" /><path d={line} fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />{points.map((point) => <g key={point.date}><circle cx={point.x} cy={point.y} r="5" fill="#fbbf24" /><text x={point.x} y={height - 8} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,.6)">{point.label}</text></g>)}</svg>;
}
