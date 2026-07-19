import { AlertTriangle, Globe2, MapPin, RadioTower, TrendingUp, Waves } from 'lucide-react';
import { Earthquake } from '../../../../types';
import { countryOf, statsFor } from '../../../../components/dashboard/data';

export default function OverviewStatGrid({ earthquakes }: { earthquakes: Earthquake[] }) {
  const stats = statsFor(earthquakes);
  const topCountry = topActiveCountry(earthquakes);
  const cards = [
    ['Total Earthquakes Today', stats.today, Globe2, 'from-cyan-500 to-blue-500'],
    ['Average Magnitude', stats.avgMag.toFixed(1), TrendingUp, 'from-green-500 to-emerald-500'],
    ['Strongest Earthquake', stats.strongest.toFixed(1), AlertTriangle, 'from-red-600 to-orange-500'],
    ['Most Active Country', topCountry, MapPin, 'from-violet-500 to-fuchsia-500'],
    ['Tsunami Warnings', stats.tsunami, Waves, 'from-blue-600 to-cyan-400'],
    ['High Risk Regions', stats.red, RadioTower, 'from-red-800 to-red-500'],
  ] as const;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map(([label, value, Icon, gradient]) => (
        <article key={label} className="group rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">+5%</span>
          </div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
          <strong className="mt-2 block text-3xl font-black text-slate-950">{value}</strong>
          <div className="mt-5 flex h-8 items-end gap-1">
            {[34, 52, 40, 70, 58, 82, 64].map((height, index) => (
              <span key={index} className={`w-full rounded-t bg-gradient-to-t ${gradient}`} style={{ height: `${height}%` }} />
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

function topActiveCountry(events: Earthquake[]) {
  const counts = new Map<string, number>();
  events.forEach((event) => counts.set(countryOf(event.place), (counts.get(countryOf(event.place)) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';
}
