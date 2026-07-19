import { Earthquake } from '../../../../types';
import { markerColor } from '../../../../components/dashboard/mapStyles';
import { fmtDate } from '../../../../components/dashboard/data';

export default function LiveTimeline({ events }: { events: Earthquake[] }) {
  return (
    <aside className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
      <h2 className="text-xl font-black text-slate-950">Live Timeline</h2>
      <div className="mt-5 space-y-4">
        {events.slice(0, 8).map((event) => (
          <div key={event.id} className="relative pl-7">
            <span className="absolute left-0 top-1 h-3 w-3 rounded-full animate-pulse" style={{ backgroundColor: markerColor(event.magnitude) }} />
            <p className="font-black text-slate-950">M {event.magnitude.toFixed(1)}</p>
            <p className="line-clamp-1 text-sm text-slate-600">{event.place}</p>
            <p className="text-xs font-semibold text-slate-400">{fmtDate(event.time, 'UTC')}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
