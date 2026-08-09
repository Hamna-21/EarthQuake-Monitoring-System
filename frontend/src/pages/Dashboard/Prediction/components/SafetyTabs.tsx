import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

const tabs = {
  Before: ['Prepare water, food, medicine, flashlight, and power bank.', 'Secure heavy furniture and know safe spots.'],
  During: ['Drop, Cover, and Hold On.', 'Stay away from windows, elevators, and unstable objects.'],
  After: ['Expect aftershocks and check for injuries.', 'Follow official alerts before returning to damaged buildings.'],
};

export default function SafetyTabs() {
  const [active, setActive] = useState<keyof typeof tabs>('Before');
  return <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"><h2 className="flex items-center gap-2 font-serif text-xl font-black text-white"><ShieldCheck className="h-4 w-4" />Before / During / After</h2><div className="mt-3 flex gap-2">{Object.keys(tabs).map((tab) => <button key={tab} onClick={() => setActive(tab as keyof typeof tabs)} className={`rounded-xl px-4 py-2 text-xs font-black transition ${active === tab ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white' : 'bg-black/20 text-slate-300'}`}>{tab}</button>)}</div><ul className="mt-3 space-y-2 text-sm text-slate-300">{tabs[active].map((item) => <li key={item} className="rounded-xl border border-white/10 bg-black/20 p-3">{item}</li>)}</ul></section>;
}
