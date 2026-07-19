import { Activity } from 'lucide-react';

export default function HeroBadge() {
  return (
    <div className="mb-6 inline-flex items-center gap-2 border border-cyan-300/20 bg-cyan-400/10 px-5 py-2 backdrop-blur-xl shadow-lg shadow-cyan-900/20">
      <Activity className="h-4 w-4 animate-pulse text-cyan-200" />
      <span className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-100">
        Global Seismic Intelligence
      </span>
    </div>
  );
}
