import { ChevronLeft } from 'lucide-react';

type PageBackButtonProps = {
  label?: string;
  onClick: () => void;
};

export default function PageBackButton({ label = 'Back', onClick }: PageBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      <ChevronLeft className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}