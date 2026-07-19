import { useEffect, useState } from 'react';
import { Activity, X } from 'lucide-react';
import SafetyAssistantPanel from './components/SafetyAssistantPanel';
import SafetyChecklist from './components/SafetyChecklist';
import SafetyHubVideo from './components/SafetyHubVideo';
import SafetyMetricGrid from './components/SafetyMetricGrid';

interface WarningHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WarningHub({ isOpen, onClose }: WarningHubProps) {
  const [showCrack, setShowCrack] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setShowCrack(false);
    const timer = window.setTimeout(() => setShowCrack(true), 2200);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(239,68,68,0.16),transparent_32%)]" />
      <section
        id="safety-hub"
        className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[28px] border border-white/10 bg-white/[0.06] text-white shadow-2xl shadow-black/40 backdrop-blur-2xl animate-earthquake"
      >
       
        <header className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-white/10 bg-slate-950/85 p-6 backdrop-blur-xl">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-cyan-200">
              <Activity className="h-4 w-4" /> Safety Hub
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              Emergency readiness center
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Preparedness score, emergency kit, family plan, learning tools,
              and calm earthquake response guidance in one command surface.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/10 p-3 text-slate-200 transition hover:bg-white/20"
            aria-label="Close Safety Hub"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="space-y-5 p-5 md:p-6">
          <SafetyMetricGrid />
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <SafetyHubVideo />
            <SafetyAssistantPanel />
          </div>
          <SafetyChecklist />
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-red-300/20 bg-red-500/10 p-5 sm:flex-row">
            <p className="text-sm font-semibold text-red-50">
              Emergency Mode: share location, follow local instructions, and keep this checklist visible.
            </p>
            <button
              onClick={onClose}
              className="rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-red-700/25"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
