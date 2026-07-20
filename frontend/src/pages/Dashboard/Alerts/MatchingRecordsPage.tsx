import { useEffect, useMemo, useState } from 'react';
import { Gauge, Layers, CalendarClock, MapPin, BellRing } from 'lucide-react';
import { DashboardProps } from '../../../components/dashboard/types';
import { fmtDate, countryOf } from '../../../components/dashboard/data';
import { magnitudeStyle, alertStyle } from '../../../components/dashboard/colors';

type Rule = { id: number; name: string; minMag: number; radiusKm: number; tsunamiOnly: boolean };

const STORAGE_KEY = 'geopulse-alert-rules';

function severityOf(minMag: number) {
  if (minMag >= 6) return { gradient: 'from-rose-500 via-red-600 to-orange-600', tint: 'from-rose-50 to-orange-50', border: 'border-rose-200' };
  if (minMag >= 5) return { gradient: 'from-amber-500 via-orange-600 to-red-600', tint: 'from-amber-50 to-orange-50', border: 'border-amber-200' };
  return { gradient: 'from-emerald-500 via-teal-600 to-cyan-600', tint: 'from-emerald-50 to-cyan-50', border: 'border-emerald-200' };
}

function loadRules(): Rule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function MatchingRecordsPage({ earthquakes, setSelectedId, openPage }: DashboardProps) {
  const [rules, setRules] = useState<Rule[]>(() => loadRules());

  // Pick up rule changes made on the Alerts page without requiring a full reload.
  useEffect(() => {
    const onFocus = () => setRules(loadRules());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const matches = useMemo(() => {
    if (!rules.length) return [];
    return earthquakes.filter((e) => rules.some((r) => e.magnitude >= r.minMag && (!r.tsunamiOnly || e.tsunami === 1)));
  }, [earthquakes, rules]);

  return (
    <>
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-slate-950 px-6 py-6 shadow-2xl sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative">
          <p className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-300">
            <BellRing className="h-3.5 w-3.5" /> Alerts & Notifications
          </p>
          <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 bg-clip-text font-serif text-2xl font-black italic tracking-tight text-transparent sm:text-3xl">
            Records matching your rules
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-400">
            {rules.length
              ? `${matches.length} record${matches.length === 1 ? '' : 's'} currently satisfy ${rules.length} active rule${rules.length === 1 ? '' : 's'}.`
              : 'No monitoring rules exist yet — create one on the Alerts page first.'}
          </p>
        </div>
      </div>

      {matches.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((event) => {
            const s = severityOf(event.magnitude);
            return (
              <article
                key={event.id}
                onClick={() => { setSelectedId(event.id); openPage('details'); }}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border ${s.border} bg-gradient-to-br ${s.tint} p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`rounded-xl border px-3 py-1.5 text-sm font-black ${magnitudeStyle(event.magnitude)}`}>
                    M {event.magnitude.toFixed(1)}
                  </span>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wide ${alertStyle(event.alert)}`}>
                    {event.alert ?? 'No alert'}
                  </span>
                </div>

                <h4 className="mt-3 truncate font-serif text-base font-black italic tracking-tight text-slate-900" title={event.place}>
                  {event.place}
                </h4>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <MapPin className="h-3 w-3 text-violet-500" /> {countryOf(event.place)}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5 text-orange-500" /> {event.depth.toFixed(1)} km</span>
                  <span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5 text-cyan-500" /> {fmtDate(event.time, 'UTC')}</span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
          {rules.length ? 'No records currently match your rules.' : 'Create a rule on the Alerts page to see matches here.'}
        </p>
      )}
    </>
  );
}