import { Earthquake } from '../../../../types';
import { magnitudeStyle } from '../../../../components/dashboard/colors';
import { countryOf, fmtDate } from '../../../../components/dashboard/data';
import Badge from '../../../../components/dashboard/Badge';

export default function MajorTimeline({ events, onSelect }: { events: Earthquake[]; onSelect: (event: Earthquake) => void }) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-950">Recent Major Earthquakes</h2>
      </div>
      <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
        {events.map((event) => (
          <article key={event.id} className="min-w-72 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <Badge className={magnitudeStyle(event.magnitude)}>M {event.magnitude.toFixed(1)}</Badge>
            <h3 className="mt-4 line-clamp-2 font-black text-slate-950">{event.place}</h3>
            <p className="mt-2 text-sm text-slate-500">{countryOf(event.place)}</p>
            <p className="mt-3 text-sm font-semibold text-slate-600">{fmtDate(event.time, 'UTC')}</p>
            <p className="mt-1 text-sm font-bold text-orange-700">{event.depth.toFixed(1)} km deep</p>
            <button onClick={() => onSelect(event)} className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700">View Details</button>
          </article>
        ))}
      </div>
    </section>
  );
}
