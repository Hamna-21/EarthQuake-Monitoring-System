import { History } from 'lucide-react';

export default function HistoryPageHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative mb-4 overflow-hidden rounded-2xl border border-cyan-400/15 bg-slate-950/80 px-5 py-4 shadow-xl shadow-black/20">
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl" />
      <p className="flex items-center gap-2 font-serif text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
        <History className="h-3.5 w-3.5" /> {label}
      </p>
      <h1 className="mt-1 font-serif text-xl font-black tracking-tight text-white sm:text-2xl">{title}</h1>
      <p className="mt-1 max-w-3xl text-sm font-medium text-slate-400">{description}</p>
    </section>
  );
}
