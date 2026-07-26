export default function AssistantAction({ onClick, icon, label, disabled, danger }: { onClick: () => void; icon: React.ReactNode; label: string; disabled?: boolean; danger?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold transition disabled:pointer-events-none disabled:opacity-40 ${danger ? 'border-red-300/20 bg-red-500/10 text-red-100 hover:bg-red-500/20' : 'border-white/10 bg-white/10 text-slate-100 hover:bg-white/15'}`}>
      {icon}{label}
    </button>
  );
}
