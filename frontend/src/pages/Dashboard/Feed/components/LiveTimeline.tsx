import { Earthquake } from '../../../../types';
import { markerColor } from '../../../../components/map/mapStyles';
import { fmtDate } from '../../../../components/dashboard/data';

export default function LiveTimeline({ events }: { events: Earthquake[] }) {
  return (
    <aside className="relative h-fit overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur xl:sticky xl:top-4">
      <p className="font-serif text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-200">As It Happens</p>
      <h2 className="mt-1 font-serif text-base font-black text-white">Live Timeline</h2>

      {events.length ? (
        <div className="mt-4 max-h-[480px] overflow-y-auto overflow-x-hidden pr-1">
          <div className="ml-2 space-y-3 border-l border-dashed border-cyan-200/20 pl-3">
            {events.map((e, i) => {
              const c = markerColor(e.magnitude);
              return (
                <div key={e.id} className="group relative -ml-[17px] pl-5">
                  <span className="absolute left-0 top-1 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ backgroundColor: c, boxShadow: i === 0 ? `0 0 8px 2px ${c}66` : undefined }} />
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-serif text-xs font-black" style={{ color: c }}>M {e.magnitude.toFixed(1)}</p>
                    <p className="shrink-0 text-[10px] text-slate-500">{fmtDate(e.time, 'UTC')}</p>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-300">{e.place}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-center text-xs text-slate-400">Nothing to report yet.</p>
      )}
    </aside>
  );
}
