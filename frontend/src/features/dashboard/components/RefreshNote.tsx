import { AlertTriangle, Clock, Wifi } from 'lucide-react';
import GeoPulseMascot from '@/features/dashboard/components/GeoPulseMascot';
import { ds } from '@/features/dashboard/utils/designSystem';

export default function RefreshNote({
  isLoading,
  error,
  lastUpdated,
  userName,
}: {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: number | null;
  userName?: string | null;
}) {
  if (error) {
    return (
      <div className={`${ds.surface} mb-7 flex items-center gap-3 border-red-500/20 bg-red-500/10 p-4 text-sm font-semibold text-red-100`}>
        <AlertTriangle className="h-5 w-5" /> {error}
      </div>
    );
  }

  const updatedText = lastUpdated ? ` · Last updated ${new Date(lastUpdated).toLocaleTimeString()}` : '';
  const name = userName?.trim();

  return (
    <div className={`${ds.surface} relative mb-8 flex items-center gap-3 overflow-visible px-5 py-4 ${name ? 'pr-28' : ''}`}>
      {isLoading ? <Clock className="h-5 w-5 animate-spin text-cyan-300" /> : <Wifi className="h-5 w-5 text-emerald-300" />}
      <span className="text-sm font-medium text-slate-300">
        {isLoading ? 'Refreshing earthquake records...' : `Live earthquake feed is connected${updatedText}.`}
      </span>
      {name && (
        <div className="absolute -right-1 -top-8 hidden items-end gap-0.5 sm:flex">
          <div className="relative mb-8 -mr-2 rounded-2xl rounded-br-sm border border-cyan-300/20 bg-white/[0.08] px-3 py-2 text-[11px] font-semibold leading-4 text-cyan-50 shadow-lg shadow-cyan-950/20 backdrop-blur-md">
            <span className="block">Hi, <span className="font-black text-cyan-300">{name}</span>!</span>
            <span className="block">Welcome to GeoPulse.</span>
            <span className="absolute -bottom-1.5 right-3 h-3 w-3 rotate-45 border-b border-r border-cyan-300/20 bg-slate-900/80" />
          </div>
          <GeoPulseMascot size="md" />
        </div>
      )}
    </div>
  );
}
