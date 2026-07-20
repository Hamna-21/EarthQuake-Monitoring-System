import { Bookmark, Compass, LocateFixed, Share2 } from 'lucide-react';
import { Earthquake } from '../../../../types';
import { alertStyle, magnitudeStyle } from '../../../../components/dashboard/colors';
import { countryOf, fmtDate } from '../../../../components/dashboard/data';
import Badge from '../../../../components/dashboard/Badge';

const severityGlow = (m: number) => {
  if (m >= 7) return { glow: 'rgba(153,27,27,0.18)', ring: 'ring-red-900/10' };
  if (m >= 6) return { glow: 'rgba(220,38,38,0.16)', ring: 'ring-red-500/10' };
  if (m >= 5) return { glow: 'rgba(249,115,22,0.16)', ring: 'ring-orange-500/10' };
  if (m >= 4) return { glow: 'rgba(245,158,11,0.14)', ring: 'ring-amber-400/10' };
  return { glow: 'rgba(16,185,129,0.12)', ring: 'ring-emerald-400/10' };
};

export default function LiveFeedCard({ event, onDetails }: { event: Earthquake; onDetails: (event: Earthquake) => void }) {
  const share = async () => navigator.clipboard?.writeText(`${event.place} M ${event.magnitude.toFixed(1)} ${event.url}`);
  const severity = severityGlow(event.magnitude);

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-5 shadow-sm ring-1 ${severity.ring} backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-150"
        style={{ background: severity.glow }}
      />

      <div className="relative flex items-start gap-4">
        <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl border font-serif text-xl font-black italic shadow-sm ${magnitudeStyle(event.magnitude)}`}>
          {event.magnitude.toFixed(1)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge className="border-red-500 bg-red-50 text-red-700">
              <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 align-middle" />
              Live
            </Badge>
            <Badge className={alertStyle(event.alert)}>{event.alert ?? 'No Alert'}</Badge>
          </div>
          <h3 className="mt-3 line-clamp-2 font-serif text-xl font-black tracking-tight text-slate-950">{event.place}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-500">
            <Compass className="h-3.5 w-3.5 text-slate-400" />
            {countryOf(event.place)}
          </p>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <Info label="Depth" value={`${event.depth.toFixed(1)} km`} accent="from-cyan-400 to-blue-500" />
        <Info label="Time" value={fmtDate(event.time, 'UTC')} accent="from-violet-400 to-fuchsia-500" />
        <Info label="Status" value={event.status} accent="from-emerald-400 to-teal-500" />
        <Info label="Coords" value={`${event.latitude.toFixed(2)}, ${event.longitude.toFixed(2)}`} accent="from-amber-400 to-orange-500" />
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2">
        <button onClick={() => onDetails(event)} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700">
          Read the full report
        </button>
        <button className="rounded-xl border border-slate-200 bg-white p-2 text-cyan-600 transition-colors hover:border-cyan-300 hover:bg-cyan-50" title="Locate on map">
          <LocateFixed className="h-4 w-4" />
        </button>
        <button onClick={share} className="rounded-xl border border-slate-200 bg-white p-2 text-fuchsia-600 transition-colors hover:border-fuchsia-300 hover:bg-fuchsia-50" title="Copy share link">
          <Share2 className="h-4 w-4" />
        </button>
        <button className="rounded-xl border border-slate-200 bg-white p-2 text-amber-600 transition-colors hover:border-amber-300 hover:bg-amber-50" title="Save">
          <Bookmark className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function Info({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-50 p-3">
      <span className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${accent}`} />
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 truncate font-mono font-black text-slate-800">{value}</p>
    </div>
  );
}