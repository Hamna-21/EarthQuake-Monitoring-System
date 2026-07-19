interface DetailCardProps {
  label: string;
  value: string | number;
  tone?: string;
}

export default function DetailCard({ label, value, tone = 'text-slate-950' }: DetailCardProps) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <strong className={`mt-3 block text-xl font-black ${tone}`}>{value}</strong>
    </article>
  );
}
