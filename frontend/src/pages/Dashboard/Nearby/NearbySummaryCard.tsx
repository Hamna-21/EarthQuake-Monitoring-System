export default function NearbySummaryCard({
  icon, label, value, gradient, tint, border,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
  tint: string;
  border: string;
}) {
  return (
    <article className={`group relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${tint} p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/[0.08] hover:shadow-xl`}>
      <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-20`} />
      <div className="relative flex items-center gap-2">
        <span className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
          {icon}
        </span>
        <p className="font-serif text-[10px] font-black uppercase tracking-[0.18em] text-slate-300">{label}</p>
      </div>
      <strong className="relative mt-3 block font-serif text-3xl font-black tracking-tight text-white">
        {value}
      </strong>
    </article>
  );
}
