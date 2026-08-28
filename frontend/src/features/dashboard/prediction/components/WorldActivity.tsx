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
    badge: 'world-activity__risk--very-high',
    icon: Flame,
    dot: 'world-activity__risk-dot--very-high',
  },
  High: {
    badge: 'world-activity__risk--high',
    icon: TriangleAlert,
    dot: 'world-activity__risk-dot--high',
  },
};

/** Renders or coordinates world activity for this frontend module. */
export default function WorldActivity() {
  return (
    <section className="world-activity">
      <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="world-activity__heading">
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
      <div className="world-activity__chart">
        <p className="font-serif text-sm font-black text-white">Countries in high-risk zones</p>
        <div className="world-activity__chart-frame">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="countries" nameKey="zone" innerRadius="48%" outerRadius="76%" paddingAngle={4}>
                {chartData.map((item, index) => (
                  <Cell key={item.zone} fill={colors[index]} stroke="#0f172a" strokeWidth={1.5} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12, fontSize: 12 }} formatter={(value) => [`${value} countries listed`, 'Countries']} />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-slate-400">Countries appearing in more than one zone are counted in each relevant zone.</p>
      </div>
      <div className="world-activity__zones">
        {zones.map((item, index) => {
          const { badge, icon: Icon, dot } = riskStyle[item.risk];
          return (
            <div key={item.zone} className="world-activity__zone">
              <div className="world-activity__zone-head">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10" style={{ backgroundColor: `${colors[index]}26`, color: colors[index] }}>
                  <Globe2 className="h-3.5 w-3.5" />
                </span>
                <span className="font-serif text-sm font-black text-white">{item.zone}</span>
                <span className={`world-activity__risk ${badge}`}>
                  <Icon className="h-3 w-3" />
                  {item.risk} Risk
                </span>
                <span className={`world-activity__risk-dot ${dot}`} />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-300">{item.explanation}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.countries.split(', ').map((c) => (
                  <span key={c} className="world-activity__country">{c}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
/** Displays the global activity context used alongside prediction results. */
