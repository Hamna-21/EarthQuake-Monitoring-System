import { AlertTriangle, Globe2, MapPin, RadioTower, TrendingUp, Waves } from 'lucide-react';
import { Earthquake } from '../../../../types';
import { statsFor } from '../../../../components/dashboard/data';
import OverviewStatCard from './OverviewStatCard';
import { spark, toneStyles, topActiveCountry } from './overviewHelpers';

type CardTone = keyof typeof toneStyles;

export default function OverviewStatGrid({ earthquakes }: { earthquakes: Earthquake[] }) {
  const stats = statsFor(earthquakes);
  const topCountry = topActiveCountry(earthquakes);
  const cards = [
    ['Loaded Events', 'current live dataset', earthquakes.length, Globe2, 'from-cyan-500 to-blue-500', 'shadow-cyan-500/20', 'neutral', 'Live', 3],
    ['Average Magnitude', 'across loaded activity', stats.avgMag.toFixed(1), TrendingUp, 'from-emerald-500 to-teal-400', 'shadow-emerald-500/20', 'positive', 'Stable', 5],
    ['Strongest Event', 'peak magnitude recorded', stats.strongest.toFixed(1), AlertTriangle, 'from-orange-500 to-red-600', 'shadow-red-500/20', 'alert', 'Peak', 8],
    ['Most Active Ground', 'by earthquake frequency', topCountry, MapPin, 'from-fuchsia-500 to-violet-500', 'shadow-fuchsia-500/20', 'neutral', 'Region', 2],
    ['Tsunami Warnings', 'currently in effect', stats.tsunami, Waves, 'from-sky-500 to-cyan-400', 'shadow-sky-500/20', stats.tsunami > 0 ? 'alert' : 'positive', stats.tsunami > 0 ? 'Active' : 'Clear', 6],
    ['High-Risk Regions', 'flagged for elevated activity', stats.red, RadioTower, 'from-rose-700 to-red-500', 'shadow-rose-600/20', stats.red > 0 ? 'alert' : 'positive', stats.red > 0 ? 'Watching' : 'Quiet', 9],
  ] as const;

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Situation Room</p>
          <h2 className="mt-1 font-serif text-xl font-black tracking-tight text-white">Global Pulse, at a Glance</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, caption, value, icon, gradient, glow, tone, tag, seed]) => (
          <OverviewStatCard
            key={label}
            label={label}
            caption={caption}
            value={value}
            icon={icon}
            gradient={gradient}
            glow={glow}
            toneChip={toneStyles[tone as CardTone].chip}
            tag={tag}
            bars={spark(seed)}
          />
        ))}
      </div>
    </section>
  );
}
