import type { Earthquake } from '@/types';
import { countryOf, fmtDate } from '@/features/dashboard/utils/data';
import { markerColor } from './globeMarkers';

/** Shows lightweight event context on hover; the full shared popup remains click-only. */
export default function GlobeHoverTooltip({ event, position }: { event: Earthquake; position: { x: number; y: number } }) {
  return <div className="pointer-events-none absolute z-40 w-60 -translate-x-1/2 translate-y-4 rounded-xl border border-cyan-200/25 bg-slate-950/95 px-3 py-2.5 font-serif text-white shadow-2xl backdrop-blur-xl" style={{ left: position.x, top: position.y }}>
    <p className="text-lg font-black" style={{ color: markerColor(event.magnitude) }}>M{event.magnitude.toFixed(1)}</p>
    <p className="mt-0.5 line-clamp-2 text-xs font-bold text-white">{event.place}</p>
    <p className="mt-0.5 text-[10px] font-semibold text-cyan-100">{countryOf(event.place)}</p>
    <p className="mt-1 text-[10px] font-semibold text-slate-300">{fmtDate(event.time, 'UTC')}</p>
  </div>;
}
