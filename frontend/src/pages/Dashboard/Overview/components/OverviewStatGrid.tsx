import { AlertTriangle, Globe2, MapPin, RadioTower, TrendingUp, Waves } from 'lucide-react';
import { Earthquake } from '../../../../types';
import { countryOf, statsFor } from '../../../../components/dashboard/data';

type CardTone = 'neutral' | 'positive' | 'alert';

const toneStyles: Record<CardTone, { chip: string; ring: string }> = {
  neutral: { chip: 'bg-slate-100 text-slate-600', ring: 'ring-slate-200/60' },
  positive: { chip: 'bg-emerald-50 text-emerald-700', ring: 'ring-emerald-200/60' },
  alert: { chip: 'bg-red-50 text-red-700', ring: 'ring-red-200/60' },
};

// deterministic pseudo-sparkline per card, so bars aren't an identical copy-paste shape everywhere
const spark = (seed: number) =>
  Array.from({ length: 7 }, (_, i) => 28 + ((seed * (i + 3) * 37) % 62));

export default function OverviewStatGrid({ earthquakes }: { earthquakes: Earthquake[] }) {
  const stats = statsFor(earthquakes);
  const topCountry = topActiveCountry(earthquakes);

  const cards = [
    {
      label: 'Recorded Today',
      caption: 'seismic events worldwide',
      value: stats.today,
      icon: Globe2,
      gradient: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/20',
      tone: 'neutral' as CardTone,
      tag: 'Live',
      seed: 3,
    },
    {
      label: 'Average Magnitude',
      caption: 'across today\u2019s activity',
      value: stats.avgMag.toFixed(1),
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-400',
      glow: 'shadow-emerald-500/20',
      tone: 'positive' as CardTone,
      tag: 'Stable',
      seed: 5,
    },
    {
      label: 'Strongest Event',
      caption: 'peak magnitude recorded',
      value: stats.strongest.toFixed(1),
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-red-600',
      glow: 'shadow-red-500/20',
      tone: 'alert' as CardTone,
      tag: 'Peak',
      seed: 8,
    },
    {
      label: 'Most Active Ground',
      caption: 'by earthquake frequency',
      value: topCountry,
      icon: MapPin,
      gradient: 'from-fuchsia-500 to-violet-500',
      glow: 'shadow-fuchsia-500/20',
      tone: 'neutral' as CardTone,
      tag: 'Region',
      seed: 2,
    },
    {
      label: 'Tsunami Warnings',
      caption: 'currently in effect',
      value: stats.tsunami,
      icon: Waves,
      gradient: 'from-sky-500 to-cyan-400',
      glow: 'shadow-sky-500/20',
      tone: stats.tsunami > 0 ? ('alert' as CardTone) : ('positive' as CardTone),
      tag: stats.tsunami > 0 ? 'Active' : 'Clear',
      seed: 6,
    },
    {
      label: 'High-Risk Regions',
      caption: 'flagged for elevated activity',
      value: stats.red,
      icon: RadioTower,
      gradient: 'from-rose-700 to-red-500',
      glow: 'shadow-rose-600/20',
      tone: stats.red > 0 ? ('alert' as CardTone) : ('positive' as CardTone),
      tag: stats.red > 0 ? 'Watching' : 'Quiet',
      seed: 9,
    },
  ];

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Situation Room</p>
          <h2 className="mt-1 font-serif text-xl font-black tracking-tight text-slate-950">
            Global Pulse, at a Glance
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, caption, value, icon: Icon, gradient, glow, tone, tag, seed }) => {
          const t = toneStyles[tone];
          const bars = spark(seed);
          return (
            <article
              key={label}
              className={`group relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm ring-1 ${t.ring} backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glow}`}
            >
              <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-[0.07] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.14]`} />

              <div className="relative flex items-center justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${t.chip}`}>
                  {tone === 'alert' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />}
                  {tag}
                </span>
              </div>

              <p className="relative mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
              <strong className="relative mt-1 block font-serif text-3xl font-black tracking-tight text-slate-950">{value}</strong>
              <p className="relative mt-1 text-xs font-semibold text-slate-400">{caption}</p>

              <div className="relative mt-5 flex h-8 items-end gap-1">
                {bars.map((height, index) => (
                  <span
                    key={index}
                    className={`w-full rounded-t bg-gradient-to-t ${gradient} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function topActiveCountry(events: Earthquake[]) {
  const counts = new Map<string, number>();
  events.forEach((event) => counts.set(countryOf(event.place), (counts.get(countryOf(event.place)) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
}