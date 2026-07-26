export default function NearbyInfoTile({
  icon, label, value, gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="flex items-center gap-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {icon}
        {label}
      </p>
      <p className={`mt-1 truncate bg-gradient-to-r ${gradient} bg-clip-text text-sm font-black text-transparent`} title={value}>
        {value}
      </p>
    </div>
  );
}
