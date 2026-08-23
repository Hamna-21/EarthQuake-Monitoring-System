import { Activity } from 'lucide-react';

/** Renders or coordinates hero badge for this frontend module. */
export default function HeroBadge() {
  return (
    <div className="mb-6 inline-flex max-w-[min(100%,24rem)] items-center justify-center gap-2 border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-center backdrop-blur-xl shadow-lg shadow-cyan-900/20 sm:px-5">
      <Activity className="h-4 w-4 animate-pulse text-cyan-200" />
      <span className="text-[10px] font-semibold uppercase leading-tight tracking-[0.16em] text-cyan-100 sm:text-xs sm:tracking-[0.22em]">
        Earthquake Monitoring System
      </span>
    </div>
  );
}
/** Displays the compact trust or status badge in the landing-page hero. */
