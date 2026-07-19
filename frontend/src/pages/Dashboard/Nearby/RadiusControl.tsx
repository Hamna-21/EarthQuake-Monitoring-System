const radii = [50, 100, 200, 500, 1000];

interface RadiusControlProps {
  radius: number;
  onChange: (radius: number) => void;
}

export default function RadiusControl({ radius, onChange }: RadiusControlProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Search radius</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {radii.map((value) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${
              radius === value ? 'bg-red-700 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {value} km
          </button>
        ))}
      </div>
    </div>
  );
}
