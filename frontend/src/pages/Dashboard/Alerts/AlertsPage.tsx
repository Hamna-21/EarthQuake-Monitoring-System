import React, { useMemo, useState } from 'react';
import { BellPlus } from 'lucide-react';
import { DashboardProps } from '../../../components/dashboard/types';
import { EventList } from '../../../components/dashboard/ui';
import { PageTitle } from '../../../components/dashboard/Shell';

type Rule = { id: number; name: string; minMag: number; radiusKm: number; tsunamiOnly: boolean };

export default function AlertsPage({ earthquakes, setSelectedId, openPage }: DashboardProps) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [name, setName] = useState('Magnitude watch');
  const [minMag, setMinMag] = useState(5.5);
  const [radiusKm, setRadiusKm] = useState(300);
  const [tsunamiOnly, setTsunamiOnly] = useState(false);
  const matches = useMemo(() => {
    if (!rules.length) return [];
    return earthquakes.filter((e) => rules.some((r) => e.magnitude >= r.minMag && (!r.tsunamiOnly || e.tsunami === 1))).slice(0, 10);
  }, [earthquakes, rules]);
  const addRule = () => setRules((items) => [...items, { id: Date.now(), name, minMag, radiusKm, tsunamiOnly }]);
  return (
    <>
      <PageTitle eyebrow="Alerts & Notifications" title="Create monitoring rules" subtitle="Define practical rules against real earthquake records. Delivery integrations can be connected later." />
      <section className="mb-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-slate-950">New Rule</h3>
          <label className="mt-4 block text-sm font-bold text-slate-600">Rule name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3" /></label>
          <label className="mt-4 block text-sm font-bold text-slate-600">Magnitude exceeds {minMag}<input type="range" min="0" max="9" step="0.1" value={minMag} onChange={(e) => setMinMag(Number(e.target.value))} className="mt-2 w-full accent-red-700" /></label>
          <label className="mt-4 block text-sm font-bold text-slate-600">Within {radiusKm} km<input type="range" min="50" max="2000" step="50" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} className="mt-2 w-full accent-red-700" /></label>
          <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-600"><input type="checkbox" checked={tsunamiOnly} onChange={(e) => setTsunamiOnly(e.target.checked)} /> Tsunami warnings only</label>
          <button onClick={addRule} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-3 text-sm font-black text-white hover:bg-red-800"><BellPlus className="h-4 w-4" /> Add rule</button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xl font-black text-slate-950">Monitoring Rules</h3>
          <div className="mt-4 space-y-3">
            {rules.length ? rules.map((r) => <div key={r.id} className="rounded-xl bg-slate-50 p-4"><b>{r.name}</b><p className="text-sm text-slate-500">M {r.minMag}+ within {r.radiusKm} km {r.tsunamiOnly ? 'and tsunami only' : ''}</p></div>) : <p className="text-sm text-slate-500">No rules created yet.</p>}
          </div>
        </div>
      </section>
      <h3 className="mb-3 text-xl font-black text-slate-950">Current Records Matching Rules</h3>
      <EventList events={matches} onSelect={(e) => { setSelectedId(e.id); openPage('details'); }} />
    </>
  );
}
