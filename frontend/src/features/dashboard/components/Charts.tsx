import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

import type { Earthquake } from '@/types';

type ChartProps = {
  events: Earthquake[];
};

function emptyChart(message = 'No matching earthquake data') {
  return (
    <div className="flex h-[220px] items-center justify-center rounded-2xl border border-white/10 bg-black/10 text-sm text-white/45">
      {message}
    </div>
  );
}


function dayLabel(time: string | number | Date) {
  return new Date(time).toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
  });
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

/* ----------------------------- Timeline / Area ----------------------------- */

export function TimelineChart({ events }: ChartProps) {
  if (!events.length) return emptyChart();

  const countsByDay = new Map<string, number>();

  for (const event of events) {
    const key = new Date(event.time).toISOString().slice(0, 10);
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
  }

  const rows = Array.from(countsByDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, count]) => ({
      date,
      label: new Date(date).toLocaleDateString(undefined, {
        month: 'short',
        day: '2-digit',
      }),
      value: count,
    }));

  if (!rows.length) return emptyChart();

  const width = 520;
  const height = 220;
  const left = 26;
  const right = 14;
  const top = 18;
  const bottom = 28;

  const chartW = width - left - right;
  const chartH = height - top - bottom;
  const max = Math.max(...rows.map((r) => r.value), 1);

  const pts = rows.map((r, i) => {
    const x = left + (i / Math.max(rows.length - 1, 1)) * chartW;
    const y = top + chartH - (r.value / max) * chartH;
    return { ...r, x, y };
  });

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${top + chartH} L ${pts[0].x} ${top + chartH} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full">
        <defs>
          <linearGradient id="timeline-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {[0, 1, 2].map((i) => {
          const y = top + (chartH / 2) * i;
          return (
            <line
              key={i}
              x1={left}
              x2={width - right}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1"
            />
          );
        })}

        <path d={areaPath} fill="url(#timeline-fill)" />
        <path
          d={linePath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {pts.map((p, i) => (
          <g key={`${p.date}-${i}`}>
            <circle cx={p.x} cy={p.y} r="5" fill="#fbbf24" />
            <circle cx={p.x} cy={p.y} r="2.5" fill="#fff" opacity="0.9" />
            <text
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(255,255,255,0.6)"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function rankAttentionEvents(events: Earthquake[], limit = 6) {
  return events
    .map((event) => {
      const magnitude = Number(event.magnitude ?? 0);
      const depth = Number(event.depth ?? 0);
      const shallownessBonus = Math.max(0, 120 - depth) / 12;
      const score = magnitude * 10 + shallownessBonus;

      return {
        ...event,
        magnitude,
        depth,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((event, index) => ({
      ...event,
      rank: index + 1,
    }));
}

const attentionRankColors = ['#f43f5e', '#fb7185', '#fb923c', '#fbbf24', '#fcd34d', '#fde68a'];

function AttentionTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ReturnType<typeof rankAttentionEvents>[number] }>;
}) {
  if (!active || !payload?.length) return null;

  const event = payload[0].payload;

  return (
    <div className="max-w-xs rounded-xl border border-white/15 bg-slate-950/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="font-bold leading-snug text-white">
        #{event.rank} {event.place}
      </p>
      <p className="mt-1 text-slate-300">
        M{event.magnitude.toFixed(1)} · {Math.round(event.depth)} km depth
      </p>
      <p className="mt-0.5 font-semibold text-amber-300">
        Attention score {event.score.toFixed(1)}
      </p>
    </div>
  );
}

/* --------------------- Attention / Bubble Scatter Chart -------------------- */

export function MagnitudeDepthChart({ events }: ChartProps) {
  if (!events.length) return emptyChart();

  const ranked = rankAttentionEvents(events);
  if (!ranked.length) return emptyChart();

  const minMag = Math.min(...ranked.map((event) => event.magnitude));
  const maxMag = Math.max(...ranked.map((event) => event.magnitude));
  const maxDepth = Math.max(...ranked.map((event) => event.depth), 1);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-2">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          <span>Magnitude increases →</span>
          <span className="text-rose-300/80">Shallower depth ↑</span>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart margin={{ top: 12, right: 12, bottom: 8, left: 4 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <XAxis
              type="number"
              dataKey="magnitude"
              domain={[Math.max(0, minMag - 0.3), maxMag + 0.3]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            />
            <YAxis
              type="number"
              dataKey="depth"
              reversed
              domain={[0, maxDepth + 20]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
              label={{
                value: 'Depth (km)',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b',
                fontSize: 11,
              }}
            />
            <ZAxis type="number" dataKey="score" range={[140, 520]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<AttentionTooltip />} />
            <Scatter data={ranked} fill="#f97316">
              {ranked.map((event) => (
                <Cell
                  key={event.id ?? `${event.place}-${event.rank}`}
                  fill={attentionRankColors[(event.rank - 1) % attentionRankColors.length]}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        <p className="px-2 pb-1 text-[11px] text-white/45">
          Bubble size reflects attention score. Top-right events are stronger and shallower.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {ranked.map((event) => (
          <div
            key={event.id ?? `${event.place}-${event.rank}`}
            className="flex gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"
          >
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-black text-white shadow-lg"
              style={{
                backgroundColor: attentionRankColors[(event.rank - 1) % attentionRankColors.length],
              }}
            >
              {event.rank}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug text-white">{event.place}</p>
              <p className="mt-0.5 text-xs text-white/55">
                M{event.magnitude.toFixed(1)} · {Math.round(event.depth)} km · attention{' '}
                {event.score.toFixed(1)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------- Depth / Doughnut Chart ------------------------- */

export function DepthChart({ events }: ChartProps) {
  if (!events.length) return emptyChart();

  const buckets = {
    near: events.filter((e) => Number(e.depth ?? 0) < 70).length,
    mid: events.filter((e) => {
      const d = Number(e.depth ?? 0);
      return d >= 70 && d < 300;
    }).length,
    deep: events.filter((e) => Number(e.depth ?? 0) >= 300).length,
  };

  const total = buckets.near + buckets.mid + buckets.deep;
  if (!total) return emptyChart();

  const segments = [
    { label: 'Near Surface', value: buckets.near, color: '#22d3ee' },
    { label: 'Mid-Depth', value: buckets.mid, color: '#a78bfa' },
    { label: 'Very Deep', value: buckets.deep, color: '#fb7185' },
  ];

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let runningOffset = 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[190px_minmax(0,1fr)] md:items-center">
      <div className="mx-auto flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="h-[160px] w-[160px]">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="18"
          />

          {segments.map((segment) => {
            const dash = (segment.value / total) * circumference;
            const circle = (
              <circle
                key={segment.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="18"
                strokeLinecap="butt"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-runningOffset}
                transform="rotate(-90 80 80)"
              />
            );
            runningOffset += dash;
            return circle;
          })}

          <circle cx="80" cy="80" r="34" fill="#070b17" />
          <text
            x="80"
            y="76"
            textAnchor="middle"
            fontSize="18"
            fill="#fff"
            fontWeight="700"
          >
            {total}
          </text>
          <text
            x="80"
            y="95"
            textAnchor="middle"
            fontSize="10"
            fill="rgba(255,255,255,0.58)"
          >
            records
          </text>
        </svg>
      </div>

      <div className="space-y-3">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <div>
                <p className="text-sm font-semibold text-white">{segment.label}</p>
                <p className="text-xs text-white/50">
                  {segment.value} event{segment.value === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <p className="text-sm font-semibold text-white/85">
              {percent(segment.value, total)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}