import { Activity } from 'lucide-react';

export default function NavbarLogo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute -top-7 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3"
      aria-label="Go to GeoPulse home"
    >
      <Activity className="h-8 w-8 animate-pulse text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
      <span className="bg-gradient-to-r from-white via-red-300 to-orange-400 bg-clip-text text-2xl font-black uppercase tracking-[0.25em] text-transparent">
        GeoPulse
      </span>
    </button>
  );
}
