import type { Earthquake } from '@/types';
import { fmtDate } from '@/features/dashboard/utils/data';
import { markerColor } from './globeMarkers';

export default function GlobeHoverTooltip({ event, position }: { event: Earthquake; position: { x: number; y: number } }) {
  const depth = Number.isFinite(event.depth) ? `${event.depth.toFixed(1)} km` : 'Unknown';
  return <div className="pointer-events-none absolute z-40 w-60 -translate-x-1/2 translate-y-4 rounded-xl border border-cyan-200/25 bg-slate-950/95 px-3 py-2.5 font-serif text-white shadow-2xl backdrop-blur-xl" style={{ left: position.x, top: position.y }}>
    <p className="text-lg font-black" style={{ color: markerColor(event.magnitude) }}>M{event.magnitude.toFixed(1)}</p>
    <p className="mt-0.5 line-clamp-2 text-xs font-bold text-white">{event.place}</p>
    <p className="mt-1 text-[10px] font-semibold text-slate-300">{fmtDate(event.time, 'UTC')}</p>
    <p className="text-[10px] font-semibold text-slate-300">Depth {depth} | Tsunami {event.tsunami ? 'Yes' : 'No'}</p>
    <p className="text-[10px] font-semibold text-cyan-100">{event.latitude.toFixed(2)}, {event.longitude.toFixed(2)}</p>
  </div>;
}
