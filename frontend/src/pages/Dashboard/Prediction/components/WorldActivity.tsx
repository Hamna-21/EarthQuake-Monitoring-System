import { Globe2, Flame, TriangleAlert, Sparkles } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type Zone = {
  zone: string;
  countries: string;
  countryCount: number;
  risk: 'Very High' | 'High';
  explanation: string;
};

const zones: Zone[] = [
  {
    zone: 'Pacific Ring of Fire',
    countries: 'Japan, Indonesia, Philippines, Chile, Mexico, USA (West Coast), Peru, New Zealand',
    countryCount: 8,
    risk: 'Very High',
    explanation:
      'A horseshoe-shaped Pacific belt where the Pacific Plate meets surrounding plates. Constant subduction causes about 90% of the world\'s earthquakes and 75% of active volcanoes.',
  },
  {
    zone: 'Alpide Belt',
    countries: 'Turkey, Iran, Pakistan, Afghanistan, Nepal, Italy, Greece, India',
    countryCount: 8,
    risk: 'High',
    explanation:
      'Runs from the Mediterranean through the Middle East and Himalayas where the Eurasian Plate collides with the African, Arabian, and Indian Plates. It produces about 17% of the largest earthquakes.',
  },
  {
    zone: 'Himalayan Front',
    countries: 'India, Nepal, Bhutan, Pakistan',
    countryCount: 4,
    risk: 'High',
    explanation:
      'The Indian Plate continues colliding with the Eurasian Plate, producing some of the largest continental earthquakes on record.',
  },
];

const chartData = zones.map(({ zone, countryCount }) => ({ zone, countries: countryCount }));
const colors = ['#fb7185', '#fb923c', '#facc15'];

const riskStyle: Record<Zone['risk'], { badge: string; icon: typeof Flame; dot: string }> = {
  'Very High': {
    badge: 'border-rose-300/30 bg-gradient-to-r from-rose-500/25 to-orange-500/15 text-rose-100',
    icon: Flame,
    dot: 'bg-rose-400 shadow-[0_0_10px_2px_rgba(251,113,133,0.7)]',
  },
  High: {
    badge: 'border-amber-300/30 bg-gradient-to-r from-amber-500/25 to-yellow-500/15 text-amber-100',
    icon: TriangleAlert,
    dot: 'bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.7)]',
  },
};

export default function WorldActivity() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.09] via-white/[0.04] to-transparent p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      {/* ambient glow blobs */}
      <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-300/30 bg-rose-400/15 shadow-[0_0_14px_rgba(251,113,133,0.35)]">
          <Globe2 className="h-4 w-4 text-rose-300" />
        </span>
        <div>
          <h2 className="font-serif text-xl font-black tracking-tight text-white">Predicted High-Risk Earthquake Zones</h2>
          <p className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Sparkles className="h-3 w-3 text-amber-300" />
            Based on historical frequency and plate boundary type
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-5 rounded-xl border border-white/10 bg-white/[0.05] p-4 shadow-inner ring-1 ring-white/10 backdrop-blur-md">
        <p className="font-serif text-sm font-black text-white">Countries in high-risk zones</p>
        <div className="mt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="countries" nameKey="zone" innerRadius="48%" outerRadius="76%" paddingAngle={4}>
                {chartData.map((item, index) => (
                  <Cell key={item.zone} fill={colors[index]} stroke="#0f172a" strokeWidth={1.5} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12, fontSize: 12 }}
                formatter={(value) => [`${value} countries listed`, 'Countries']}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-slate-400">
          Countries appearing in more than one zone are counted in each relevant zone.
        </p>
      </div>

      {/* Zone cards */}
      <div className="relative mt-4 space-y-3">
        {zones.map((item, index) => {
          const { badge, icon: Icon, dot } = riskStyle[item.risk];
          return (
            <div
              key={item.zone}
              className="rounded-xl border border-white/10 bg-white/[0.05] p-4 shadow-inner ring-1 ring-white/10 backdrop-blur-md transition-colors hover:border-white/20"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10"
                  style={{ backgroundColor: `${colors[index]}26`, color: colors[index] }}
                >
                  <Globe2 className="h-3.5 w-3.5" />
                </span>
                <span className="font-serif text-sm font-black text-white">{item.zone}</span>
                <span className={`ml-auto flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black ${badge}`}>
                  <Icon className="h-3 w-3" />
                  {item.risk} Risk
                </span>
                <span className={`h-2 w-2 rounded-full ${dot}`} />
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-300">{item.explanation}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.countries.split(', ').map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-slate-200"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}