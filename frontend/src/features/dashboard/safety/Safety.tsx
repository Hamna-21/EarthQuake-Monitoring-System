import { Activity, ArrowDown, X } from 'lucide-react';
import SafetyAssistantPanel from '@/features/dashboard/safety/components/SafetyAssistantPanel';
import SafetyChecklist from '@/features/dashboard/safety/components/SafetyChecklist';
import SafetyHubVideo from '@/features/dashboard/safety/components/SafetyHubVideo';
import SafetyMetricGrid from '@/features/dashboard/safety/components/SafetyMetricGrid';

interface WarningHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WarningHub({ isOpen, onClose }: WarningHubProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 backdrop-blur-xl sm:p-3">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(239,68,68,0.18),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(249,115,22,0.14),transparent_32%)]" />
      <section
        id="safety-hub"
        className="relative z-10 max-h-[96vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/75 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl"
      >
       
        <header className="sticky top-0 z-20 flex items-start justify-between gap-3 overflow-hidden border-b border-white/10 bg-slate-950/90 p-4 backdrop-blur-xl sm:p-5">
          <div className="relative min-w-0">
            <div className="pointer-events-none absolute -left-12 -top-20 h-44 w-44 rounded-full bg-orange-500/20 blur-3xl" />
            <p className="relative flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-200">
              <Activity className="h-4 w-4" /> Safety Hub
            </p>
            <h2 className="relative mt-1 max-w-3xl font-serif text-xl font-black tracking-tight sm:text-3xl">Emergency readiness center</h2>
            <p className="relative mt-1.5 max-w-2xl text-[11px] leading-4 text-slate-300">Practical actions, warning signs, and calm earthquake response guidance in one place.</p>
            <span className="relative mt-3 inline-flex items-center gap-1.5 rounded-full border border-orange-300/20 bg-orange-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-orange-100"><ArrowDown className="h-3 w-3" /> Start with preparedness</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-slate-200 transition hover:border-orange-300/30 hover:bg-orange-500/10"
            aria-label="Close Safety Hub"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="space-y-5 p-4 md:p-5">
          <SafetyMetricGrid />
          <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
            <SafetyHubVideo />
            <SafetyAssistantPanel />
          </div>
          <SafetyChecklist />
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-red-300/20 bg-gradient-to-r from-red-500/15 to-orange-500/10 p-5 sm:flex-row">
            <p className="text-sm font-semibold text-red-50">
              Emergency Mode: share location, follow local instructions, and keep this checklist visible.
            </p>
            <button
              onClick={onClose}
              className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-red-700/25 transition hover:brightness-110"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
