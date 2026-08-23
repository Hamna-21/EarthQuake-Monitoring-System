import { useState } from 'react';
import { ShieldCheck, PackageCheck, Siren, HeartPulse, Sparkles } from 'lucide-react';

type TabKey = 'Before' | 'During' | 'After';

const tabs: Record<TabKey, { icon: typeof PackageCheck; grad: string; text: string; dot: string; items: string[] }> = {
  Before: {
    icon: PackageCheck, grad: 'from-emerald-500 to-teal-500 shadow-[0_0_16px_rgba(52,211,153,0.45)]',
    text: 'text-emerald-200', dot: 'bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.7)]',
    items: ['Prepare water, food, medicine, flashlight, and a power bank for 72 hours.', 'Secure heavy furniture and shelves to walls to prevent tipping.', 'Know safe spots in each room and set a family meeting point.'],
  },
  During: {
    icon: Siren, grad: 'from-rose-500 to-orange-500 shadow-[0_0_16px_rgba(251,113,133,0.45)]',
    text: 'text-rose-200', dot: 'bg-rose-400 shadow-[0_0_10px_2px_rgba(251,113,133,0.7)]',
    items: ['Drop, Cover, and Hold On — get under sturdy furniture.', 'Stay away from windows, elevators, and unstable objects.', 'If outdoors, move to open ground away from buildings and wires.'],
  },
  After: {
    icon: HeartPulse, grad: 'from-indigo-500 to-violet-500 shadow-[0_0_16px_rgba(129,140,248,0.45)]',
    text: 'text-indigo-200', dot: 'bg-indigo-400 shadow-[0_0_10px_2px_rgba(129,140,248,0.7)]',
    items: ['Expect aftershocks and check for injuries first.', 'Follow official alerts before entering damaged buildings.', 'Check gas, water, and electrical lines before use.'],
  },
};

/** Renders or coordinates safety tabs for this frontend module. */
export default function SafetyTabs() {
  const [active, setActive] = useState<TabKey>('Before');
  const { icon: ActiveIcon, text, dot, items } = tabs[active];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.09] via-white/[0.04] to-transparent p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-300/30 bg-rose-400/15 shadow-[0_0_14px_rgba(251,113,133,0.35)]"><ShieldCheck className="h-4 w-4 text-rose-300" /></span>
        <div>
          <h2 className="font-serif text-xl font-black tracking-tight text-white">Before / During / After</h2>
          <p className="flex items-center gap-1 text-[11px] font-medium text-slate-400"><Sparkles className="h-3 w-3 text-indigo-300" />What to do at each stage</p>
        </div>
      </div>

      <div className="relative mt-4 flex gap-2">
        {(Object.keys(tabs) as TabKey[]).map((tab) => {
          const t = tabs[tab];
          return (
            <button key={tab} onClick={() => setActive(tab)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 font-serif text-xs font-black tracking-wide transition-all ${active === tab ? `bg-gradient-to-r ${t.grad} border-white/20 text-white` : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'}`}>
              <t.icon className="h-3.5 w-3.5" />{tab}
            </button>
          );
        })}
      </div>

      <div className="relative mt-4 rounded-xl border border-white/10 bg-white/[0.05] p-4 shadow-inner ring-1 ring-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/10 ${text}`}><ActiveIcon className="h-3.5 w-3.5" /></span>
          <span className={`font-serif text-xs font-bold uppercase tracking-wide ${text}`}>{active}</span>
          <span className={`ml-auto rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-black ${text}`}>{items.length} steps</span>
          <span className={`h-2 w-2 rounded-full ${dot}`} />
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-2.5 transition-colors hover:bg-white/[0.06]">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
/** Switches between safety guidance sections within the prediction view. */
