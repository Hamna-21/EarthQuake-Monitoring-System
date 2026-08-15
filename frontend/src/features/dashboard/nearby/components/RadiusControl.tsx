import { Radar } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const RADII = [
  { km: 100, tone: 'bg-cyan-500/20 text-cyan-100 border-cyan-400/30' },
  { km: 250, tone: 'bg-violet-500/20 text-violet-100 border-violet-400/30' },
  { km: 500, tone: 'bg-amber-500/20 text-amber-100 border-amber-400/30' },
  { km: 1000, tone: 'bg-rose-500/20 text-rose-100 border-rose-400/30' },
];

export default function RadiusControl({ radius, onChange }: { radius: number; onChange: (r: number) => void }) {
  return (
    <GlassCard className="p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-slate-400">
        <Radar className="h-3.5 w-3.5" /> Search Radius
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {RADII.map(({ km, tone }) => (
          <button
            key={km}
            onClick={() => onChange(km)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${radius === km ? tone : 'border-white/10 bg-black/20 text-slate-300 hover:bg-white/10'}`}
          >
            {km} km
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
