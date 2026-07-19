import { Earthquake } from '../../../../types';
import { averageMagnitude, strongest } from './landingUtils';
import PremiumCard from './PremiumCard';
import SectionShell from './SectionShell';

interface AnalyticsPreviewProps {
  earthquakes: Earthquake[];
}

export default function AnalyticsPreview({ earthquakes }: AnalyticsPreviewProps) {
  const top = strongest(earthquakes);
  const bars = [38, 64, 46, 82, 56, 72, 48];

  return (
    <SectionShell
      eyebrow="Analytics Preview"
      title="Patterns you can read at a glance."
      subtitle="Trend cards and lightweight charts make seismic behavior easier to compare."
    >
      <div className="grid gap-5 center lg:grid-cols-[0.9fr_0.9fr]">
        <PremiumCard>
          <p className="text-sm center font-bold uppercase tracking-[0.22em] text-red-200">
            Strongest observed
          </p>
          <h3 className="mt-5 text-6xl font-black text-white">
            {top ? top.magnitude.toFixed(1) : '0.0'}
          </h3>
          <p className="mt-3 text-slate-300">{top?.place ?? 'Waiting for live records'}</p>
          <p className="mt-8 text-sm font-semibold text-cyan-100">
            Average magnitude: {averageMagnitude(earthquakes)}
          </p>
        </PremiumCard>
        
      </div>
    </SectionShell>
  );
}
