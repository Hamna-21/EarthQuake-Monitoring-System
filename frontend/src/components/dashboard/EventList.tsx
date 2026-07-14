import React from 'react';
import { Earthquake } from '../../types';
import { countryOf, fmtDate } from './data';
import EmptyState from './EmptyState';

export default function EventList({
  events,
  onSelect,
}: {
  events: Earthquake[];
  onSelect: (event: Earthquake) => void;
}) {
  if (!events.length)
    return (
      <EmptyState
        title="No Earthquake Events"
        text="No Seismic activity matches the current search."
      />
    );

  return (
    <div className="border border-red-100 bg-white shadow-lg">
      {events.map((e) => {
        const color =
          e.magnitude >= 7
            ? "bg-red-900"
            : e.magnitude >= 6
            ? "bg-red-700"
            : e.magnitude >= 5
            ? "bg-orange-600"
            : "bg-yellow-500";

        return (
          <button
            key={e.id}
            onClick={() => onSelect(e)}
            className="grid w-full gap-5 border-b border-slate-200 px-6 py-5 text-left transition hover:bg-red-50 md:grid-cols-[110px_1fr_120px_160px]"
          >
            <div
              className={`${color} flex h-12 items-center justify-center text-xl font-black text-white`}
            >
               {e.magnitude.toFixed(1)}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {e.place}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {countryOf(e.place)}
              </p>

              <p className="mt-2 text-xs uppercase tracking-wider text-slate-400">
                Event ID • {e.id}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs uppercase text-slate-500">
                Depth
              </span>

              <span className="text-xl font-black text-slate-900">
                {e.depth.toFixed(1)} km
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs uppercase text-slate-500">
                Time (UTC)
              </span>

              <span className="font-semibold text-slate-700">
                {fmtDate(e.time, "UTC")}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
