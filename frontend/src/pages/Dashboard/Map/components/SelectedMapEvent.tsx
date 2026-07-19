import { Earthquake } from '../../../../types';
import { alertStyle, magnitudeStyle } from '../../../../components/dashboard/colors';
import { fmtDate } from '../../../../components/dashboard/data';
import Badge from '../../../../components/dashboard/Badge';

export default function SelectedMapEvent({ event, onDetails }: { event: Earthquake | null; onDetails: () => void }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-slate-950/85 p-5 text-white shadow-2xl backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100">Selected Earthquake</p>
      {event ? (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <Badge className={magnitudeStyle(event.magnitude)}>M {event.magnitude.toFixed(1)}</Badge>
            <Badge className={alertStyle(event.alert)}>{event.alert ?? 'No Alert'}</Badge>
          </div>
          <h3 className="text-xl font-black">{event.place}</h3>
          <Info label="Coordinates" value={`${event.latitude.toFixed(3)}, ${event.longitude.toFixed(3)}`} />
          <Info label="Depth" value={`${event.depth.toFixed(1)} km`} />
          <Info label="Time UTC" value={fmtDate(event.time, 'UTC')} />
          <button onClick={onDetails} className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white transition hover:bg-red-500">View Details</button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">Click a ripple marker to inspect an earthquake.</p>
      )}
    </aside>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 rounded-xl bg-white/10 p-3 text-sm"><span className="text-slate-400">{label}</span><span className="text-right font-black">{value}</span></div>;
}
