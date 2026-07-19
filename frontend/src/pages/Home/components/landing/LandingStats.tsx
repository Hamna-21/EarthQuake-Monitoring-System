import { Activity, Globe2, Radio, TrendingUp } from 'lucide-react';
import { Earthquake } from '../../../../types';
import { averageMagnitude, mostActiveCountry, strongest } from './landingUtils';
import PremiumCard from './PremiumCard';
import SectionShell from './SectionShell';

interface LandingStatsProps {
  earthquakes: Earthquake[];
}

export default function LandingStats({ earthquakes }: LandingStatsProps) {
  const top = strongest(earthquakes);
  const stats = [
    { label: "Today's Earthquakes", value: earthquakes.length, icon: Activity },
    { label: 'Strongest Magnitude', value: top ? top.magnitude.toFixed(1) : '0.0', icon: TrendingUp },
    { label: 'Most Active Region', value: mostActiveCountry(earthquakes), icon: Globe2 },
    { label: 'Average Magnitude', value: averageMagnitude(earthquakes), icon: Radio },
  ];

  return (
    <SectionShell
      eyebrow="Live Global Activity"
      title="A real-time command view of Earth."
      subtitle="GeoPulse turns incoming seismic records into readable operational signals."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <PremiumCard key={label}>
            <Icon className="h-7 w-7 text-cyan-200" />
            <p className="mt-6 text-3xl font-black text-white">{value}</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              {label}
            </p>
          </PremiumCard>
        ))}
      </div>
      <div className="mt-5 border border-emerald-300/20 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-100 backdrop-blur-xl">
        Current Monitoring Status: Active global seismic watch
      </div>
    </SectionShell>
  );
}
