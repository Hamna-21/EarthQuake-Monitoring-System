import { Activity } from 'lucide-react';
import AuthStats from './AuthStats';

export default function AuthVisualPanel() {
  return (
    <aside className="relative z-10 hidden w-1/2 flex-col justify-between border-r border-white/10 bg-white/[0.04] p-14 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3">
        <Activity className="h-9 w-9 animate-pulse text-cyan-200" />
        <div>
          <p className="text-2xl font-black uppercase tracking-[0.24em] text-white">GeoPulse</p>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Enterprise access node
          </p>
        </div>
      </div>
      <div className="relative mx-auto grid h-[420px] w-[420px] place-items-center">
        <div className="absolute inset-0 rounded-full border border-cyan-300/10 bg-cyan-300/5 blur-sm" />
        <div className="absolute h-[360px] w-[360px] animate-spin rounded-full border border-dashed border-cyan-300/20" style={{ animationDuration: '44s' }} />
        <div className="absolute h-[260px] w-[260px] animate-ping rounded-full border border-red-400/20" style={{ animationDuration: '4s' }} />
        <img
          src="/images/images.jpg"
          alt="Earth access visualization"
          className="relative h-72 w-72 rounded-full object-cover shadow-[0_0_50px_rgba(14,165,233,0.35)]"
        />
      </div>
      <AuthStats />
    </aside>
  );
}
