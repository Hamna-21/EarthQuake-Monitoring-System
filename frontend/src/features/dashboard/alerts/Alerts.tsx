// AlertsPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { Gauge } from 'lucide-react';
import { Earthquake } from '@/types';
import { DashboardProps } from '@/features/dashboard/types';
import { countryOf, fmtDate } from '@/features/dashboard/utils/data';
import AlertMatches from '@/features/dashboard/alerts/components/AlertMatches';
import AlertRuleForm from '@/features/dashboard/alerts/components/AlertRuleForm';
import AlertRulesList from '@/features/dashboard/alerts/components/AlertRulesList';
import { ALERT_RULES_KEY, Rule, loadRules, matchingRecords } from '@/features/dashboard/alerts/constants';
import BackButton from '@/features/dashboard/components/common/BackButton';
import PageTitle from '@/features/dashboard/components/common/PageTitle';

/** Stores user alert rules locally and derives matching current events for the alert report list. */
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

  // Persist rule changes, while allowing the alert page to remain usable when browser storage is unavailable.
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
      <div className="mb-3 flex justify-end">
        <BackButton label="Close" onClick={() => openPage('overview')} />
      </div>
      <PageTitle className="mb-3" eyebrow="Alerts & Notifications" title="Create monitoring rules" subtitle="Define practical rules against current earthquake records." />
      <section className="mb-3 grid gap-3 xl:grid-cols-[220px_1fr]">
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
      <h3 className="mb-1.5 flex items-center gap-1.5 text-sm font-black text-white">
        <Gauge className="h-3.5 w-3.5 text-cyan-200" /> Reports matching your rules
      </h3>
      <AlertMatches matches={matches} onOpen={openEvent} highlightedEventId={highlightedEventId} />
    </>
  );
}
