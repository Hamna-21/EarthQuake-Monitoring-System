import { Point, Row } from './analyticsChartData';

const empty = <p className="rounded-2xl bg-black/20 p-8 text-center text-sm font-bold text-slate-300">No matching data to show yet.</p>;
const grid = <g>{[0, 1, 2].map((i) => <line key={i} x1="48" x2="474" y1={70 + i * 55} y2={70 + i * 55} stroke="#ffffff18" />)}</g>;

export function AreaChart({ rows }: { rows: Row[] }) {
  if (!rows.length) return empty;
  const max = Math.max(1, ...rows.map((r) => r.value));
  const pts = rows.map((r, i) => ({ ...r, x: 52 + (i / Math.max(rows.length - 1, 1)) * 410, y: 190 - (r.value / max) * 135 }));
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  const peak = pts.reduce((best, p) => (p.value > best.value ? p : best), pts[0]);
  const latest = pts.at(-1)!;
  return (
    <svg viewBox="0 0 520 240" className="h-72 w-full" role="img" aria-label="Earthquakes over recent days">
      <defs><linearGradient id="clearArea" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#f59e0b" stopOpacity=".42" /><stop offset="1" stopColor="#f59e0b" stopOpacity=".04" /></linearGradient></defs>
      {grid}<path d={`${line} L462,205 L52,205 Z`} fill="url(#clearArea)" /><path d={line} fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      {pts.map((p) => <circle key={p.label} cx={p.x} cy={p.y} r={p === peak || p === latest ? 6 : 4} fill={p === peak ? '#f43f5e' : '#fbbf24'}><title>{`${p.label}: ${p.value} earthquakes`}</title></circle>)}
      <Callout x={peak.x} y={peak.y - 14} text={`Highest ${peak.value}`} /><Callout x={latest.x} y={latest.y - 32} text={`Latest ${latest.value}`} />
      {pts.map((p, i) => i % Math.ceil(pts.length / 5) === 0 && <text key={p.label} x={p.x} y="226" textAnchor="middle" fontSize="12" fontWeight="700" fill="#cbd5e1">{p.label}</text>)}
    </svg>
  );
}

export function VerticalBars({ rows }: { rows: Row[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <svg viewBox="0 0 520 250" className="h-72 w-full" role="img" aria-label="Earthquake strength levels">
      {rows.map((r, i) => {
        const w = 380 / rows.length, h = (r.value / max) * 145, x = 66 + i * w, important = r.value === max;
        return <g key={r.label}><rect x={x + 10} y={185 - h} width={Math.max(32, w - 20)} height={h} rx="12" fill={r.color} opacity={important ? 1 : .76}><title>{`${r.label}: ${r.value} earthquakes. ${r.help ?? ''}`}</title></rect><text x={x + w / 2} y={208} textAnchor="middle" fontSize="13" fontWeight="800" fill="#e2e8f0">{r.label}</text><text x={x + w / 2} y={176 - h} textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">{r.value}</text>{important && <text x={x + w / 2} y="232" textAnchor="middle" fontSize="10" fontWeight="900" fill="#67e8f9">MOST COMMON</text>}</g>;
      })}
    </svg>
  );
}

export function DonutChart({ rows }: { rows: Row[] }) {
  const total = Math.max(1, rows.reduce((sum, r) => sum + r.value, 0));
  let offset = 0;
  return <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center"><svg viewBox="0 0 220 220" className="mx-auto h-56 w-56 -rotate-90" role="img" aria-label="Earthquake depth chart">{rows.map((r) => { const dash = (r.value / total) * 565; const node = <circle key={r.label} cx="110" cy="110" r="90" fill="none" stroke={r.color} strokeWidth="30" strokeDasharray={`${dash} 565`} strokeDashoffset={-offset}><title>{`${r.label}: ${r.value} earthquakes`}</title></circle>; offset += dash; return node; })}<circle cx="110" cy="110" r="58" fill="#020617" /></svg><Legend rows={rows} total={total} /></div>;
}

export function HorizontalBars({ rows }: { rows: Row[] }) {
  if (!rows.length) return empty;
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const tones = [
    'from-rose-500 via-orange-400 to-amber-300',
    'from-cyan-400 via-sky-400 to-blue-500',
    'from-emerald-400 via-teal-300 to-cyan-300',
    'from-violet-400 via-fuchsia-400 to-rose-300',
  ];
  return (
    <div className="space-y-3">
      {rows.map((r, i) => {
        const pct = Math.round((r.value / Math.max(total, 1)) * 100);
        return (
          <div key={r.label} className="group rounded-2xl border border-white/10 bg-slate-950/55 p-3 shadow-lg transition hover:border-orange-300/30 hover:bg-slate-900/70">
            <div className="mb-2 flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 font-serif text-sm font-black text-white ring-1 ring-white/10">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-base font-black text-white">{r.label}</p>
                <p className="text-xs font-bold text-slate-400">{pct}% of loaded region records</p>
              </div>
              <span className="rounded-full bg-orange-400/15 px-3 py-1 font-serif text-sm font-black text-orange-100 ring-1 ring-orange-300/25">{r.value}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full bg-gradient-to-r ${tones[i % tones.length]} shadow-[0_0_18px_rgba(251,146,60,0.35)]`} style={{ width: `${Math.max(8, (r.value / max) * 100)}%` }} title={`${r.label}: ${r.value} earthquakes`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ScatterChart({ points }: { points: Point[] }) {
  if (!points.length) return empty;
  const maxX = Math.max(100, ...points.map((p) => p.x)), maxY = Math.max(8, ...points.map((p) => p.y));
  return <svg viewBox="0 0 520 250" className="h-72 w-full" role="img" aria-label="Earthquakes needing attention">{grid}<rect x="48" y="42" width="148" height="70" rx="16" fill="#f59e0b18" stroke="#f59e0b55" /><text x="61" y="66" fill="#fbbf24" fontSize="12" fontWeight="900">Closer to surface</text>{points.map((p, i) => <circle key={`${p.label}-${i}`} cx={48 + (p.x / maxX) * 420} cy={205 - (p.y / maxY) * 165} r={Math.max(4, p.y / 1.25)} fill={p.color} opacity=".78"><title>{`${p.label}: strength ${p.y.toFixed(1)}, depth ${p.x.toFixed(1)} km`}</title></circle>)}<text x="220" y="236" fill="#cbd5e1" fontSize="13" fontWeight="800">Deeper underground →</text><text x="10" y="135" fill="#cbd5e1" fontSize="13" fontWeight="800" transform="rotate(-90 10 135)">Stronger ↑</text></svg>;
}

function Callout({ x, y, text }: { x: number; y: number; text: string }) {
  return <text x={x} y={Math.max(18, y)} textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">{text}</text>;
}

function Legend({ rows, total }: { rows: Row[]; total: number }) {
  return <div className="space-y-3">{rows.map((r) => <div key={r.label} className="rounded-2xl bg-black/20 p-3"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-black text-white"><span className="h-3 w-3 rounded-full" style={{ background: r.color }} />{r.label}</span><span className="font-serif text-xs font-black text-cyan-100">{r.value} • {Math.round((r.value / total) * 100)}%</span></div>{r.help && <p className="mt-1 text-xs font-semibold text-slate-400">{r.help}</p>}</div>)}</div>;
}
