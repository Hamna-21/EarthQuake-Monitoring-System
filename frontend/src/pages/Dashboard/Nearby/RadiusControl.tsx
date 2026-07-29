import { Radar } from 'lucide-react';

const radii = [
  { km: 50, gradient: 'from-emerald-500 to-teal-600' },
  { km: 100, gradient: 'from-cyan-500 to-sky-600' },
  { km: 200, gradient: 'from-violet-500 to-fuchsia-600' },
  { km: 500, gradient: 'from-amber-500 to-orange-600' },
  { km: 1000, gradient: 'from-rose-500 to-red-600' },
];

interface RadiusControlProps {
  radius: number;
  onChange: (radius: number) => void;
}

export default function RadiusControl({ radius, onChange }: RadiusControlProps) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4 shadow-sm backdrop-blur">
      <p className="flex items-center gap-2 font-serif text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        <Radar className="h-3.5 w-3.5 text-violet-500" /> Search Radius
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {radii.map(({ km, gradient }) => (
          <button
            key={km}
            onClick={() => onChange(km)}
            className={`rounded-2xl px-4 py-2 text-sm font-black transition active:scale-95 ${
              radius === km
                ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                : 'bg-white/10 text-slate-100 hover:bg-white/15'
            }`}
          >
            {km} km
          </button>
        ))}
      </div>
    </div>
  );
}


