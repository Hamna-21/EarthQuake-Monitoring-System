import React from 'react';
import { Earthquake } from '../../types';
import { countryOf } from './data';

type Tone = 'cyan' | 'violet' | 'emerald' | 'amber';

const TONE_STYLES: Record<Tone, { bar: string; track: string; text: string; chip: string; dot: string }> = {
  cyan: {
    bar: 'from-cyan-400 via-sky-500 to-blue-500',
    track: 'bg-cyan-50',
    text: 'text-blue-600',
    chip: 'bg-cyan-50 text-cyan-700',
    dot: 'bg-gradient-to-br from-cyan-400 to-blue-500',
  },
  violet: {
    bar: 'from-fuchsia-400 via-purple-500 to-violet-500',
    track: 'bg-fuchsia-50',
    text: 'text-fuchsia-600',
    chip: 'bg-fuchsia-50 text-fuchsia-700',
    dot: 'bg-gradient-to-br from-fuchsia-400 to-violet-500',
  },
  emerald: {
    bar: 'from-emerald-400 via-teal-500 to-cyan-500',
    track: 'bg-emerald-50',
    text: 'text-emerald-600',
    chip: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
  amber: {
    bar: 'from-amber-400 via-orange-500 to-rose-500',
    track: 'bg-amber-50',
    text: 'text-orange-600',
    chip: 'bg-amber-50 text-orange-700',
    dot: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
};

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone: Tone }) {
  const style = TONE_STYLES[tone];
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-500">
        <span className="truncate pr-2">{label}</span>
        <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-black ${style.chip}`}>{value}</span>
      </div>
      <div className={`h-3 overflow-hidden rounded-full ${style.track}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function MagnitudeChart({ events }: { events: Earthquake[] }) {
  const buckets = [0, 2, 4, 5, 6, 7].map((start, i, arr) => {
    const end = arr[i + 1] ?? 10;
    return { label: `M ${start}–${end}`, value: events.filter((e) => e.magnitude >= start && e.magnitude < end).length };
  });
  const max = Math.max(1, ...buckets.map((b) => b.value));
  return (
    <ChartCard title="Magnitude Distribution" subtitle="How many events fall in each magnitude band" tone="cyan">
      {buckets.map((b) => (
        <Bar key={b.label} label={b.label} value={b.value} max={max} tone="cyan" />
      ))}
    </ChartCard>
  );
}

export function DepthChart({ events }: { events: Earthquake[] }) {
  const ranges = [
    [0, 35],
    [35, 70],
    [70, 150],
    [150, 300],
    [300, 700],
  ].map(([a, b]) => ({ label: `${a}–${b} km`, value: events.filter((e) => e.depth >= a && e.depth < b).length }));
  const max = Math.max(1, ...ranges.map((b) => b.value));
  return (
    <ChartCard title="Depth Distribution" subtitle="Where events sit beneath the surface" tone="violet">
      {ranges.map((b) => (
        <Bar key={b.label} label={b.label} value={b.value} max={max} tone="violet" />
      ))}
    </ChartCard>
  );
}

export function CountryChart({ events }: { events: Earthquake[] }) {
  const counts = new Map<string, number>();
  events.forEach((e) => counts.set(countryOf(e.place), (counts.get(countryOf(e.place)) || 0) + 1));
  const rows = [...counts.entries()]
    .filter(([c]) => c !== 'Not listed')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <ChartCard title="Countries With Highest Activity" subtitle="Top 8 by recorded event count" tone="emerald">
      {rows.map(([label, value]) => (
        <Bar key={label} label={label} value={value} max={max} tone="emerald" />
      ))}
    </ChartCard>
  );
}

export function TimelineChart({ events }: { events: Earthquake[] }) {
  const counts = new Map<string, number>();
  events.forEach((e) => {
    const key = new Date(e.time).toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const rows = [...counts.entries()].sort().slice(-10);
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <ChartCard title="Activity Over Time" subtitle="Events per day, most recent 10 days" tone="amber">
      {rows.map(([label, value]) => (
        <Bar key={label} label={label} value={value} max={max} tone="amber" />
      ))}
    </ChartCard>
  );
}

function ChartCard({
  title,
  subtitle,
  tone,
  children,
}: {
  title: string;
  subtitle?: string;
  tone: Tone;
  children: React.ReactNode;
}) {
  const style = TONE_STYLES[tone];
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-md shadow-slate-200/60 sm:p-6">
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${style.bar} opacity-[0.08] blur-2xl`} />

      <div className="relative mb-5 flex items-start gap-2.5">
        <span className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${style.dot}`} />
        <div>
          <h3 className="text-base font-black text-slate-800">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs font-medium text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="relative space-y-4">{children}</div>
    </section>
  );
}