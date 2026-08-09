import { Globe2 } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type Zone = { zone: string; countries: string; countryCount: number; risk: 'Very High' | 'High'; explanation: string };

const zones: Zone[] = [
  { zone: 'Pacific Ring of Fire', countries: 'Japan, Indonesia, Philippines, Chile, Mexico, USA (West Coast), Peru, New Zealand', countryCount: 8, risk: 'Very High', explanation: 'A horseshoe-shaped Pacific belt where the Pacific Plate meets surrounding plates. Constant subduction causes about 90% of the world’s earthquakes and 75% of active volcanoes.' },
  { zone: 'Alpide Belt', countries: 'Turkey, Iran, Pakistan, Afghanistan, Nepal, Italy, Greece, India', countryCount: 8, risk: 'High', explanation: 'Runs from the Mediterranean through the Middle East and Himalayas where the Eurasian Plate collides with the African, Arabian, and Indian Plates. It produces about 17% of the largest earthquakes.' },
  { zone: 'Himalayan Front', countries: 'India, Nepal, Bhutan, Pakistan', countryCount: 4, risk: 'High', explanation: 'The Indian Plate continues colliding with the Eurasian Plate, producing some of the largest continental earthquakes on record.' },
];

const chartData = zones.map(({ zone, countryCount }) => ({ zone, countries: countryCount }));
const colors = ['#fb7185', '#fb923c', '#facc15'];

export default function WorldActivity() {
  return <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
    <h2 className="flex items-center gap-2 font-serif text-xl font-black text-white">
      <Globe2 className="h-4 w-4" />Predicted High-Risk Earthquake Zones</h2><p className="mt-1 text-xs font-semibold text-slate-400">Risk levels are based on historical earthquake frequency and plate boundary type.</p><div className="mt-4 h-72 rounded-xl border border-white/10 bg-black/20 p-3"><p className="mb-2 text-sm font-black text-white">Countries in high-risk zones</p><ResponsiveContainer width="100%" height="90%"><PieChart><Pie data={chartData} dataKey="countries" nameKey="zone" innerRadius="48%" outerRadius="76%" paddingAngle={4}>{chartData.map((item, index) => <Cell key={item.zone} fill={colors[index]} />)}</Pie><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,.15)', borderRadius: 12 }} formatter={(value) => [`${value} countries listed`, 'Countries']} /><Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} /></PieChart></ResponsiveContainer></div><p className="mt-2 text-xs text-slate-400">Country counts are based on the table below; countries appearing in more than one zone are counted in each relevant zone.</p><div className="mt-3 overflow-x-auto"><table className="min-w-[820px] w-full text-left text-sm"><thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400"><tr><th className="px-3 py-3">Zone</th><th className="px-3 py-3">Countries</th><th className="px-3 py-3">Risk Level</th><th className="px-3 py-3">Explanation</th></tr></thead><tbody className="divide-y divide-white/10">{zones.map((item) => <tr key={item.zone} className="align-top"><td className="px-3 py-3 font-black text-white">{item.zone}</td><td className="px-3 py-3 text-slate-300">{item.countries}</td><td className="px-3 py-3"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-black ${tone(item.risk)}`}>{item.risk}</span></td><td className="px-3 py-3 leading-5 text-slate-300">{item.explanation}</td></tr>)}</tbody></table></div></section>;
}

function tone(risk: Zone['risk']) {
  return risk === 'Very High' ? 'bg-rose-400/15 text-rose-100' : 'bg-orange-400/15 text-orange-100';
}
