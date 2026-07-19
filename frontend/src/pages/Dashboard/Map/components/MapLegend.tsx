const legend = [
  ['#3b82f6', 'Minor', '0-2'],
  ['#22c55e', 'Light', '2-4'],
  ['#facc15', 'Moderate', '4-5'],
  ['#f97316', 'Strong', '5-6'],
  ['#dc2626', 'Major', '6-7'],
  ['#7f1d1d', 'Great', '7+'],
];

export default function MapLegend() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-white shadow-2xl backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">Severity Legend</p>
      <div className="mt-4 space-y-2">
        {legend.map(([color, label, range]) => (
          <div key={label} className="flex items-center justify-between gap-5 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full shadow-lg" style={{ backgroundColor: color }} />
              {label}
            </span>
            <span className="font-black text-slate-300">M {range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
