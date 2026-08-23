import { Earthquake } from '@/types';
import { averageMagnitude, strongest } from '@/features/home/components/landing/landingUtils';
import PremiumCard from '@/features/home/components/landing/PremiumCard';
import SectionShell from '@/features/home/components/landing/SectionShell';

interface AnalyticsPreviewProps {
  earthquakes: Earthquake[];
}

/** Renders or coordinates analytics preview for this frontend module. */
export default function AnalyticsPreview({
  earthquakes,
}: AnalyticsPreviewProps) {
  const top = strongest(earthquakes);

  return (
    <SectionShell
      eyebrow="Analytics Preview"
      title="Seismic patterns at a glance."
      subtitle="Quick insight into recent earthquake activity and magnitude trends."
    >
      <div className="max-w-sm">
  <PremiumCard className="relative overflow-hidden border-cyan-300/20 bg-cyan-400/[0.08] p-3.5 shadow-xl shadow-cyan-950/20 backdrop-blur-2xl">
    
    {/* Soft glass glow */}
    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/10 blur-3xl" />

    <div className="relative z-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200">
        Strongest observed
      </p>

      <div className="mt-2 flex items-end gap-2">
        <p className="text-2xl font-black text-white">
          {top ? top.magnitude.toFixed(1) : '0.0'}
        </p>

        <span className="mb-1 text-[10px] font-semibold text-cyan-200/70">
          MAG
        </span>
      </div>

      <p className="mt-1 truncate text-xs text-slate-300">
        {top?.place ?? 'Waiting for live records'}
      </p>

      <div className="mt-3 border-t border-cyan-200/10 pt-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            Average magnitude
          </span>

          <span className="text-sm font-black text-cyan-100">
            {averageMagnitude(earthquakes)}
          </span>
        </div>
      </div>
    </div>
  </PremiumCard>
</div>
    </SectionShell>
  );
}
