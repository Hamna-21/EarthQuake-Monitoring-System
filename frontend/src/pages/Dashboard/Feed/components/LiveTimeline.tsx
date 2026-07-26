import { Earthquake } from '../../../../types';
import { markerColor } from '../../../../components/dashboard/mapStyles';
import { fmtDate } from '../../../../components/dashboard/data';

export default function LiveTimeline({ events }: { events: Earthquake[] }) {
  return (
    <aside className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.07] p-5 shadow-sm backdrop-blur">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400/10 via-fuchsia-400/10 to-amber-400/10 blur-3xl" />

      <p className="relative font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200">As It Happens</p>
      <h2 className="relative mt-1.5 font-serif text-xl font-black italic tracking-tight text-white">Live Timeline</h2>

      {events.length > 0 ? (
        <div className="relative mt-5 space-y-4 border-l-2 border-dashed border-cyan-200/20 pl-4">
          {events.slice(0, 8).map((event, i) => {
            const color = markerColor(event.magnitude);
            return (
              <div key={event.id} className="group relative -ml-[21px] pl-6">
                <span
                  className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-white shadow-sm"
                  style={{
                    backgroundColor: color,
                    boxShadow: i === 0 ? `0 0 0 4px ${color}22, 0 0 12px 2px ${color}66` : undefined,
                  }}
                >
                  {i === 0 && <span className="absolute inset-0 animate-ping rounded-full" style={{ backgroundColor: color, opacity: 0.6 }} />}
                </span>
                <p className="font-serif text-sm font-black" style={{ color }}>M {event.magnitude.toFixed(1)}</p>
                <p className="line-clamp-1 text-sm text-slate-300 transition-colors group-hover:text-white">{event.place}</p>
                <p className="font-mono text-xs font-semibold text-slate-400">{fmtDate(event.time, 'UTC')}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="relative mt-6 text-center text-sm font-semibold text-slate-400">Nothing to report yet.</p>
      )}
    </aside>
  );
}


