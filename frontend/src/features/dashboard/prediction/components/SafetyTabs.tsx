import { useState } from 'react';
import { ShieldCheck, PackageCheck, Siren, HeartPulse, Sparkles } from 'lucide-react';

type TabKey = 'Before' | 'During' | 'After';

const tabs: Record<TabKey, { icon: typeof PackageCheck; text: string; dot: string; items: string[] }> = {
  Before: {
    icon: PackageCheck, text: 'safety-tabs__status-label--before', dot: 'safety-tabs__step-dot--before',
    items: ['Prepare water, food, medicine, flashlight, and a power bank for 72 hours.', 'Secure heavy furniture and shelves to walls to prevent tipping.', 'Know safe spots in each room and set a family meeting point.'],
  },
  During: {
    icon: Siren, text: 'safety-tabs__status-label--during', dot: 'safety-tabs__step-dot--during',
    items: ['Drop, Cover, and Hold On — get under sturdy furniture.', 'Stay away from windows, elevators, and unstable objects.', 'If outdoors, move to open ground away from buildings and wires.'],
  },
  After: {
    icon: HeartPulse, text: 'safety-tabs__status-label--after', dot: 'safety-tabs__step-dot--after',
    items: ['Expect aftershocks and check for injuries first.', 'Follow official alerts before entering damaged buildings.', 'Check gas, water, and electrical lines before use.'],
  },
};

/** Renders or coordinates safety tabs for this frontend module. */
export default function SafetyTabs() {
  const [active, setActive] = useState<TabKey>('Before');
  const { icon: ActiveIcon, text, dot, items } = tabs[active];

  return (
    <section className="safety-tabs">
      <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="safety-tabs__heading">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-rose-300/30 bg-rose-400/15 shadow-[0_0_14px_rgba(251,113,133,0.35)]"><ShieldCheck className="h-4 w-4 text-rose-300" /></span>
        <div>
          <h2 className="font-serif text-xl font-black tracking-tight text-white">Before / During / After</h2>
          <p className="flex items-center gap-1 text-[11px] font-medium text-slate-400"><Sparkles className="h-3 w-3 text-indigo-300" />What to do at each stage</p>
        </div>
      </div>

      <div className="safety-tabs__switcher">
        {(Object.keys(tabs) as TabKey[]).map((tab) => {
          const t = tabs[tab];
          return (
            <button key={tab} onClick={() => setActive(tab)} className={`safety-tabs__tab ${active === tab ? `safety-tabs__tab--active safety-tabs__tab--${tab.toLowerCase()}` : ''}`}>
              <t.icon className="h-3.5 w-3.5" />{tab}
            </button>
          );
        })}
      </div>

      <div className="safety-tabs__content">
        <div className="safety-tabs__status">
          <span className={`safety-tabs__status-icon ${text}`}><ActiveIcon className="h-3.5 w-3.5" /></span>
          <span className={`safety-tabs__status-label ${text}`}>{active}</span>
          <span className={`safety-tabs__status-count ${text}`}>{items.length} steps</span>
          <span className={`safety-tabs__status-dot ${dot}`} />
        </div>
        <ul className="safety-tabs__list">
          {items.map((item) => (
            <li key={item} className="safety-tabs__item">
              <span className={`safety-tabs__step-dot ${dot}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
/** Switches between safety guidance sections within the prediction view. */
