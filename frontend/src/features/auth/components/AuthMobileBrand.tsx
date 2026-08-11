import { Activity } from 'lucide-react';

export default function AuthMobileBrand() {
  return (
    <div className="mb-10 mt-6 flex flex-col items-center text-center lg:hidden">
      <Activity className="mb-3 h-10 w-10 animate-pulse text-cyan-200" />
      <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-white">
        GeoPulse
      </h1>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Global Seismic Intelligence
      </p>
    </div>
  );
}
