import { Bookmark, LocateFixed, Share2 } from 'lucide-react';
import { Earthquake } from '../../../../types';
import { alertStyle, magnitudeStyle } from '../../../../components/dashboard/colors';
import { countryOf, fmtDate } from '../../../../components/dashboard/data';
import Badge from '../../../../components/dashboard/Badge';

export default function LiveFeedCard({ event, onDetails }: { event: Earthquake; onDetails: (event: Earthquake) => void }) {
  const share = async () => navigator.clipboard?.writeText(`${event.place} M ${event.magnitude.toFixed(1)} ${event.url}`);

  return (
    <article className="group rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <span className={`grid h-16 w-16 place-items-center rounded-2xl border text-xl font-black ${magnitudeStyle(event.magnitude)}`}>{event.magnitude.toFixed(1)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2"><Badge className="border-red-500 bg-red-50 text-red-700">Live</Badge><Badge className={alertStyle(event.alert)}>{event.alert ?? 'No Alert'}</Badge></div>
          <h3 className="mt-3 line-clamp-2 text-xl font-black text-slate-950">{event.place}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">{countryOf(event.place)}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <Info label="Depth" value={`${event.depth.toFixed(1)} km`} />
        <Info label="Time" value={fmtDate(event.time, 'UTC')} />
        <Info label="Status" value={event.status} />
        <Info label="Coords" value={`${event.latitude.toFixed(2)}, ${event.longitude.toFixed(2)}`} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={() => onDetails(event)} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">View Details</button>
        <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700"><LocateFixed className="h-4 w-4" /></button>
        <button onClick={share} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700"><Share2 className="h-4 w-4" /></button>
        <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700"><Bookmark className="h-4 w-4" /></button>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-3"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p><p className="mt-1 truncate font-black text-slate-800">{value}</p></div>;
}
