export default function NearbySummaryCard({ icon, label, value, gradient, border }: { icon: React.ReactNode; label: string; value: string | number; gradient: string; tint?: string; border: string }) {
  return (
    <article className={`rounded-xl border ${border} bg-white/[0.06] p-3 backdrop-blur-xl`}>
      <div className="flex items-center gap-2">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${gradient} text-white`}>{icon}</span>
        <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">{label}</p>
      </div>
      <strong className="mt-2 block text-xl font-black text-white">{value}</strong>
    </article>
  );
}