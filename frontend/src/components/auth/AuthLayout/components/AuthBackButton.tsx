import { Globe } from 'lucide-react';

export default function AuthBackButton({ onBackToHome }: { onBackToHome: () => void }) {
  return (
    <button
      onClick={onBackToHome}
      className="absolute left-6 top-6 z-50 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100 backdrop-blur-xl transition hover:bg-white/15"
    >
      <Globe className="h-4 w-4 text-cyan-200" />
      Home
    </button>
  );
}
