import type { FormEvent } from 'react';
import { Activity, Compass, Gauge, MapPin, Radar, ShieldAlert, Sparkles } from 'lucide-react';
import { fmtDate } from '../../../../components/dashboard/data';
import type { Earthquake } from '../../../../types';
import PageBackButton from '../../../../components/dashboard/PageBackButton';
import PredictionControls from './PredictionControls';
import PredictionMetricCard from './PredictionMetricCard';

type NearbyEarthquake = Earthquake & { distanceKm: number };

type PredictionViewProps = {
  locationLabel: string;
  locationQuery: string;
  locationError: string | null;
  radiusKm: number;
  radiusOptions: number[];
  isDetecting: boolean;
  isSearching: boolean;
  outlook: string;
  score: number;
  confidence: string;
  recent7DaysCount: number;
  recent30DaysCount: number;
  shallowCount: number;
  strongestMagnitude: number;
  nearestEvent: NearbyEarthquake | null;
  onLocationQueryChange: (value: string) => void;
  onRadiusChange: (value: number) => void;
  onUseLocation: () => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

function badgeClass(risk: boolean) {
  return risk
    ? 'border-rose-400/30 bg-rose-500/10 text-rose-100'
    : 'border-white/10 bg-white/5 text-slate-200';
}

export default function PredictionView(props: PredictionViewProps) {
  const nearestSummary = props.nearestEvent
    ? `${Math.round(props.nearestEvent.distanceKm)} km · M ${props.nearestEvent.magnitude.toFixed(1)} · ${fmtDate(props.nearestEvent.time)}`
    : 'Set a location to calculate local signals.';

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-3.5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/75">Prediction</p>
            <h1 className="font-serif text-xl font-black text-white">Compact risk snapshot</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PageBackButton label="Close" onClick={props.onClose} />
            <span className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${badgeClass(props.score >= 75)}`}>{props.locationLabel}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-cyan-100">{props.radiusKm} km</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-slate-200">{props.outlook}</span>
          </div>
        </div>

        <div className="mt-3 grid gap-2.5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <PredictionControls {...props} />
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Signals</p>
              <p className="truncate text-[11px] font-semibold text-slate-300">{nearestSummary}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
              <PredictionMetricCard icon={<ShieldAlert className="h-4 w-4" />} label="Risk" value={`${props.score}%`} detail="Current score" accent />
              <PredictionMetricCard icon={<Radar className="h-4 w-4" />} label="Outlook" value={props.outlook} detail="Regional trend" />
              <PredictionMetricCard icon={<Sparkles className="h-4 w-4" />} label="Confidence" value={props.confidence} detail="Data coverage" />
              <PredictionMetricCard icon={<Activity className="h-4 w-4" />} label="Activity" value={props.recent7DaysCount} detail={`30d ${props.recent30DaysCount} · shallow ${props.shallowCount}`} />
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-[11px] font-semibold text-slate-300"><span className="mr-2 text-cyan-100"><Compass className="inline h-3.5 w-3.5" /></span>Radius filter active</div>
          <div className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-[11px] font-semibold text-slate-300"><span className="mr-2 text-cyan-100"><Gauge className="inline h-3.5 w-3.5" /></span>Strongest M {props.strongestMagnitude.toFixed(1)}</div>
          <div className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-[11px] font-semibold text-slate-300"><span className="mr-2 text-rose-200"><MapPin className="inline h-3.5 w-3.5" /></span>{nearestSummary}</div>
        </div>
      </section>
    </div>
  );
}