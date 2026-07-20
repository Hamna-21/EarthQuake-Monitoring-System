import React, { useEffect, useMemo, useState } from 'react';
import { BellPlus, BellRing, Radar, Waves, Gauge, Trash2, Tags, Layers, CalendarClock, MapPin } from 'lucide-react';
import { DashboardProps } from '../../../components/dashboard/types';
import { PageTitle } from '../../../components/dashboard/Shell';
import { fmtDate, countryOf } from '../../../components/dashboard/data';
import { magnitudeStyle, alertStyle } from '../../../components/dashboard/colors';

type Rule = { id: number; name: string; minMag: number; radiusKm: number; tsunamiOnly: boolean };

const STORAGE_KEY = 'geopulse-alert-rules';

function severityOf(minMag: number) {
  if (minMag >= 6) return { gradient: 'from-rose-500 via-red-600 to-orange-600', tint: 'from-rose-50 to-orange-50', border: 'border-rose-200', label: 'High Threshold' };
  if (minMag >= 5) return { gradient: 'from-amber-500 via-orange-600 to-red-600', tint: 'from-amber-50 to-orange-50', border: 'border-amber-200', label: 'Moderate Threshold' };
  return { gradient: 'from-emerald-500 via-teal-600 to-cyan-600', tint: 'from-emerald-50 to-cyan-50', border: 'border-emerald-200', label: 'Broad Threshold' };
}

function loadRules(): Rule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function AlertsPage({ earthquakes, setSelectedId, openPage }: DashboardProps) {
  const [rules, setRules] = useState<Rule[]>(() => loadRules());
  const [name, setName] = useState('Magnitude watch');
  const [minMag, setMinMag] = useState(5.5);
  const [radiusKm, setRadiusKm] = useState(300);
  const [tsunamiOnly, setTsunamiOnly] = useState(false);

  // Persist whenever rules change, so switching tabs or reloading keeps them.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
    } catch {
      // storage unavailable (private mode, quota, etc.) — fail silently, rules still work this session
    }
  }, [rules]);

  const matches = useMemo(() => {
    if (!rules.length) return [];
    return earthquakes.filter((e) => rules.some((r) => e.magnitude >= r.minMag && (!r.tsunamiOnly || e.tsunami === 1))).slice(0, 10);
  }, [earthquakes, rules]);

  const addRule = () => {
    if (!name.trim()) return;
    setRules((items) => [...items, { id: Date.now(), name: name.trim(), minMag, radiusKm, tsunamiOnly }]);
  };
  const removeRule = (id: number) => setRules((items) => items.filter((r) => r.id !== id));

  return (
    <>
    <div className="relative mb-6 overflow-hidden rounded-lg border border-fuchsia-500/20 bg-slate-950 px-6 py-6 shadow-2xl sm:px-8">
  <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
  <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-amber-400/10 blur-3xl" />

  <div className="relative">
    <p className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-300">
      <BellRing className="h-3.5 w-3.5" /> Alerts & Notifications
    </p>
    <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300 bg-clip-text font-serif text-2xl font-black italic tracking-tight text-transparent sm:text-3xl">
      Create monitoring rules
    </h1>
    <p className="mt-2 max-w-2xl text-sm font-medium text-slate-400">
      Define practical rules against real earthquake records. Delivery integrations can be connected later.
    </p>
  </div>
</div>

      <section className="mb-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* New Rule form */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-white via-violet-50 to-fuchsia-50 p-5 shadow-lg">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-400/10 blur-3xl" />

          <h3 className="relative flex items-center gap-2 text-xl font-black text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-600 to-pink-600 text-white shadow-md">
              <BellPlus className="h-4 w-4" />
            </span>
            New Rule
          </h3>

          <label className="relative mt-5 block text-sm font-bold text-slate-600">
            <span className="flex items-center gap-1.5"><Tags className="h-3.5 w-3.5 text-violet-500" /> Rule name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-violet-200 bg-white px-3 py-3 text-slate-900 outline-none transition-colors focus:border-violet-500"
              placeholder="e.g. Pacific Rim Watch"
            />
          </label>

          <label className="relative mt-4 block text-sm font-bold text-slate-600">
            <span className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-orange-500" /> Magnitude exceeds</span>
              <span className="rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 px-2.5 py-0.5 font-mono text-xs font-black text-white shadow shadow-orange-300/50">
                {minMag.toFixed(1)}
              </span>
            </span>
            <input type="range" min="0" max="9" step="0.1" value={minMag} onChange={(e) => setMinMag(Number(e.target.value))} className="mt-3 w-full accent-orange-500" />
          </label>

          <label className="relative mt-4 block text-sm font-bold text-slate-600">
            <span className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Radar className="h-3.5 w-3.5 text-cyan-500" /> Within radius</span>
              <span className="rounded-full bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-600 px-2.5 py-0.5 font-mono text-xs font-black text-white shadow shadow-cyan-300/50">
                {radiusKm} km
              </span>
            </span>
            <input type="range" min="50" max="2000" step="50" value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} className="mt-3 w-full accent-cyan-600" />
          </label>

          <label className="relative mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3 text-sm font-bold text-blue-800">
            <span className="flex items-center gap-2"><Waves className="h-4 w-4" /> Tsunami warnings only</span>
            <input type="checkbox" checked={tsunamiOnly} onChange={(e) => setTsunamiOnly(e.target.checked)} className="h-4 w-4 accent-blue-600" />
          </label>

          <button
            onClick={addRule}
            disabled={!name.trim()}
            className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-600 to-pink-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-300/40 transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
          >
            <BellPlus className="h-4 w-4" /> Add Rule
          </button>
        </div>

        {/* Existing rules */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-xl font-black text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-600 text-white shadow-md">
              <BellRing className="h-4 w-4" />
            </span>
            Monitoring Rules
          </h3>

          <div className="mt-4 space-y-3">
            {rules.length ? (
              rules.map((r) => {
                const s = severityOf(r.minMag);
                return (
                  <div key={r.id} className={`relative overflow-hidden rounded-xl border ${s.border} bg-gradient-to-br ${s.tint} p-4`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <b className="truncate text-slate-900">{r.name}</b>
                        <p className="mt-1 text-sm font-semibold text-slate-600">
                          M {r.minMag.toFixed(1)}+ within {r.radiusKm} km{r.tsunamiOnly ? ' · tsunami only' : ''}
                        </p>
                        <span className={`mt-2 inline-block rounded-full bg-gradient-to-r ${s.gradient} px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wide text-white`}>
                          {s.label}
                        </span>
                      </div>
                      <button
                        onClick={() => removeRule(r.id)}
                        className="flex-shrink-0 rounded-lg border border-rose-200 bg-white p-2 text-rose-600 shadow-sm transition hover:bg-rose-50 active:scale-90"
                        title={`Delete "${r.name}"`}
                        aria-label={`Delete rule ${r.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                No rules created yet — build one on the left to start monitoring.
              </p>
            )}
          </div>
        </div>
      </section>

      <h3 className="mb-3 flex items-center gap-2 text-xl font-black text-slate-900">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white shadow-md">
          <Gauge className="h-4 w-4" />
        </span>
        Current Records Matching Rules
      </h3>

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
          No records currently match your rules.
        </p>
      )}
    </>
  );
}