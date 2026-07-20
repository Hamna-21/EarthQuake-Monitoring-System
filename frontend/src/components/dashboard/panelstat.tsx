export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-cyan-950/40 p-5 text-white shadow-2xl shadow-cyan-900/20 backdrop-blur">
      {children}
    </aside>
  );
}

export function PanelHeader({
  icon,
  accent,
  title,
}: {
  icon: React.ReactNode;
  accent: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br ${accent} shadow-lg shadow-black/20`}
      >
        {icon}
      </span>
      <p className="truncate text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
        {title}
      </p>
    </div>
  );
}

export function Divider() {
  return (
    <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
  );
}