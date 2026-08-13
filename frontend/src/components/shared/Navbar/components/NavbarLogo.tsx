import { Activity } from 'lucide-react';

export default function NavbarLogo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute -top-7 left-1/2 z-50 flex max-w-[78vw] -translate-x-1/2 items-center gap-2"
      aria-label="Go to Earthquake Monitoring System home"
    >
      <Activity className="h-7 w-7 shrink-0 animate-pulse text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
      <span className="max-w-[min(72vw,28rem)] text-center bg-gradient-to-r from-white via-red-300 to-orange-400 bg-clip-text text-xs font-black uppercase leading-tight tracking-[0.12em] text-transparent sm:text-base sm:tracking-[0.16em]">
        Earthquake Monitoring System
      </span>
    </button>
  );
}
