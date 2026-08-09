import { ArrowUpRight, Compass, Clock3 } from 'lucide-react';
import { Earthquake } from '../../../../types';
import { markerColor } from '../../../../components/map/mapStyles';
import { countryOf, fmtDate } from '../../../../components/dashboard/data';

export default function LiveFeedCard({
  event,
  onDetails,
  highlighted = false,
}: {
  event: Earthquake;
  onDetails: (event: Earthquake) => void;
  highlighted?: boolean;
}) {
  const color = markerColor(event.magnitude);

  return (
    <article
      className={`
        group relative overflow-hidden rounded-xl
        border bg-white/[0.055] p-3
        shadow-lg shadow-black/15
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-0.5
        hover:bg-white/[0.08]
        ${
          highlighted
            ? 'border-white/30 ring-1 ring-white/10'
            : 'border-white/10'
        }
      `}
      style={{
        boxShadow: highlighted
          ? `0 0 18px ${color}25`
          : `0 8px 24px rgba(0,0,0,0.15)`,
      }}
    >
      {/* subtle magnitude accent */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px]"
        style={{ backgroundColor: color }}
      />

      <div className="flex gap-3">
        {/* MAGNITUDE */}
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border font-serif text-sm font-black backdrop-blur-xl"
          style={{
            color,
            borderColor: `${color}55`,
            backgroundColor: `${color}18`,
            boxShadow: `0 0 14px ${color}15`,
          }}
        >
          {event.magnitude.toFixed(1)}
        </div>

        {/* CONTENT */}
        <div className="min-w-0 flex-1">
          <p className="flex items-start gap-1.5 text-[13px] font-bold leading-snug text-white">
            <Compass
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              style={{ color }}
            />

            <span className="break-words">
              {countryOf(event.place)}
            </span>
          </p>

          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock3 className="h-3 w-3 shrink-0" />

            {fmtDate(event.time, 'UTC')}
          </p>

          {/* BUTTON */}
          <button
            type="button"
            onClick={() => onDetails(event)}
            className="
              mt-2 flex w-full items-center justify-center gap-1.5
              rounded-lg border
              px-3 py-1.5
              text-[11px] font-bold
              backdrop-blur-xl
              transition-all duration-200
              hover:bg-white/[0.10]
            "
            style={{
              color,
              borderColor: `${color}40`,
              backgroundColor: `${color}10`,
            }}
          >
            View details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
