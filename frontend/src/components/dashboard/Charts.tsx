import React from 'react';
import { Earthquake } from '../../types';
import { countryOf } from './data';

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-bold text-slate-500"><span>{label}</span><span>{value}</span></div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-red-700" style={{ width: `${max ? (value / max) * 100 : 0}%` }} /></div>
    </div>
  );
}

export function MagnitudeChart({ events }: { events: Earthquake[] }) {
  const buckets = [0, 2, 4, 5, 6, 7].map((start, i, arr) => {
    const end = arr[i + 1] ?? 10;
    return { label: `${start}-${end}`, value: events.filter((e) => e.magnitude >= start && e.magnitude < end).length };
  });
  const max = Math.max(1, ...buckets.map((b) => b.value));
  return <ChartCard title="Magnitude Distribution">{buckets.map((b) => <Bar key={b.label} label={b.label} value={b.value} max={max} />)}</ChartCard>;
}

export function DepthChart({ events }: { events: Earthquake[] }) {
  const ranges = [[0, 35], [35, 70], [70, 150], [150, 300], [300, 700]].map(([a, b]) => ({ label: `${a}-${b} km`, value: events.filter((e) => e.depth >= a && e.depth < b).length }));
  const max = Math.max(1, ...ranges.map((b) => b.value));
  return <ChartCard title="Depth Distribution">{ranges.map((b) => <Bar key={b.label} label={b.label} value={b.value} max={max} />)}</ChartCard>;
}

export function CountryChart({ events }: { events: Earthquake[] }) {
  const counts = new Map<string, number>();
  events.forEach((e) => counts.set(countryOf(e.place), (counts.get(countryOf(e.place)) || 0) + 1));
  const rows = [...counts.entries()].filter(([c]) => c !== 'Not listed').sort((a, b) => b[1] - a[1]).slice(0, 8);
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return <ChartCard title="Countries With Highest Activity">{rows.map(([label, value]) => <Bar key={label} label={label} value={value} max={max} />)}</ChartCard>;
}

export function TimelineChart({ events }: { events: Earthquake[] }) {
  const counts = new Map<string, number>();
  events.forEach((e) => {
    const key = new Date(e.time).toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const rows = [...counts.entries()].sort().slice(-10);
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return <ChartCard title="Activity Over Time">{rows.map(([label, value]) => <Bar key={label} label={label} value={value} max={max} />)}</ChartCard>;
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="mb-5 text-lg font-black text-slate-950">{title}</h3><div className="space-y-4">{children}</div></section>;
}
