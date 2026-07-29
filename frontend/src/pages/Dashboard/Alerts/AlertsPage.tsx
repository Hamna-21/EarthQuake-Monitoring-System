import { useEffect, useMemo, useState } from 'react';
import { Gauge } from 'lucide-react';
import { Earthquake } from '../../../types';
import { DashboardProps } from '../../../components/dashboard/types';
import { countryOf, fmtDate } from '../../../components/dashboard/data';
import AlertMatches from './components/AlertMatches';
import AlertRuleForm from './components/AlertRuleForm';
import AlertRulesList from './components/AlertRulesList';
import { ALERT_RULES_KEY, Rule, loadRules, matchingRecords } from './alertRules';

export default function AlertsPage({ earthquakes, setSelectedId, openPage, globalSearch = '', highlightedEventId }: DashboardProps) {
  const [rules, setRules] = useState<Rule[]>(() => loadRules());
  const [name, setName] = useState('Magnitude watch');
  const [minMag, setMinMag] = useState(5.5);
  const [radiusKm, setRadiusKm] = useState(300);
  const [tsunamiOnly, setTsunamiOnly] = useState(false);
  const matches = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return matchingRecords(earthquakes, rules).filter((event) => {
      const text = `${event.place} ${countryOf(event.place)} ${event.id} ${event.magnitude} ${event.alert ?? ''} ${event.status} ${fmtDate(event.time, 'UTC')}`.toLowerCase();
      return !q || text.includes(q);
    });
  }, [earthquakes, rules, globalSearch]);

  useEffect(() => {
    try {
      localStorage.setItem(ALERT_RULES_KEY, JSON.stringify(rules));
    } catch {
      // Rules still work for this session if browser storage is unavailable.
    }
  }, [rules]);

  const addRule = () => {
    if (!name.trim()) return;
    setRules((items) => [...items, { id: Date.now(), name: name.trim(), minMag, radiusKm, tsunamiOnly }]);
  };
  const openEvent = (event: Earthquake) => {
    setSelectedId(event.id);
    openPage('details');
  };

  return (
    <>
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 px-6 py-6 shadow-2xl sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">Alerts & Notifications</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Create monitoring rules</h1>
        <p className="mt-2 max-w-2xl text-sm font-medium text-slate-400">Define practical rules against current earthquake records.</p>
      </div>
      <section className="mb-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <AlertRuleForm
          name={name}
          setName={setName}
          minMag={minMag}
          setMinMag={setMinMag}
          radiusKm={radiusKm}
          setRadiusKm={setRadiusKm}
          tsunamiOnly={tsunamiOnly}
          setTsunamiOnly={setTsunamiOnly}
          addRule={addRule}
        />
        <AlertRulesList rules={rules} removeRule={(id) => setRules((items) => items.filter((rule) => rule.id !== id))} />
      </section>
      <h3 className="mb-3 flex items-center gap-2 text-xl font-black text-white">
        <Gauge className="h-5 w-5 text-cyan-200" /> Reports matching your rules
      </h3>
      <AlertMatches matches={matches} onOpen={openEvent} highlightedEventId={highlightedEventId} />
    </>
  );
}


