import { Bot, RadioTower } from 'lucide-react';
import SafetyCard from './SafetyCard';

const tips = [
  'Move away from windows and unstable shelves.',
  'Drop to hands and knees before shaking knocks you down.',
  'Cover your head and neck under sturdy furniture.',
  'Hold on until shaking fully stops.',
];

export default function SafetyAssistantPanel() {
  return (
    <SafetyCard className="h-full">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300/10">
          <Bot className="h-6 w-6 text-cyan-200" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
            AI Safety Assistant
          </p>
          <h3 className="text-2xl font-black text-white">GeoBot guidance</h3>
        </div>
      </div>
      <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 leading-7 text-slate-200">
        I will keep the response simple: protect your head, stay low, and move only after shaking stops.
      </p>
      <div className="mt-5 space-y-3">
        {tips.map((tip) => (
          <p key={tip} className="flex gap-3 text-sm text-slate-300">
            <RadioTower className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
            {tip}
          </p>
        ))}
      </div>
    </SafetyCard>
  );
}
