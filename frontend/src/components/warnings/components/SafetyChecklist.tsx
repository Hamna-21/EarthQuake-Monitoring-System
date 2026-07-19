import { CheckCircle2 } from 'lucide-react';
import SafetyCard from './SafetyCard';

const checks = [
  'Water, food, flashlight, power bank, radio',
  'Shoes and first-aid kit near sleeping area',
  'Family meeting point and emergency contact plan',
  'Gas, electricity, and exit route awareness',
  'Practice drop-cover-hold once this week',
  'Save local emergency numbers offline',
];

export default function SafetyChecklist() {
  return (
    <SafetyCard>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
            Emergency Checklist
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">Preparedness actions</h3>
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-100">
          6 essentials
        </span>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {checks.map((check) => (
          <p key={check} className="flex gap-3 rounded-2xl bg-white/[0.05] p-4 text-sm text-slate-200">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-200" />
            {check}
          </p>
        ))}
      </div>
    </SafetyCard>
  );
}
