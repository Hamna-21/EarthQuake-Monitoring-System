import { Radar } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const RADII = [
  { km: 100, tone: 'bg-cyan-500/20 text-cyan-100 border-cyan-400/30' },
  { km: 250, tone: 'bg-violet-500/20 text-violet-100 border-violet-400/30' },
  { km: 500, tone: 'bg-amber-500/20 text-amber-100 border-amber-400/30' },
  { km: 1000, tone: 'bg-rose-500/20 text-rose-100 border-rose-400/30' },
];

/** Renders or coordinates radius control for this frontend module. */
export default function RadiusControl({ radius, onChange }: { radius: number; onChange: (r: number) => void }) {
  return (
    <GlassCard className="nearby-radius-card">
      <p className="nearby-radius-card__label">
        <Radar className="h-3.5 w-3.5" /> Search Radius
      </p>
      <div className="nearby-radius-card__options">
        {RADII.map(({ km, tone }) => (
          <button
            key={km}
            onClick={() => onChange(km)}
            className={`nearby-radius-card__option ${radius === km ? tone : 'border-white/10 bg-black/20 text-slate-300 hover:bg-white/10'}`}
          >
            {km} km
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
/** Provides the radius selector used to constrain nearby earthquake results. */
