import React from 'react';
import { Earthquake } from '../../../../types';
import { countryOf, fmtDate } from '../../../../components/dashboard/data';

interface EventDetailsAsideProps {
  event: Earthquake;
}

export default function EventDetailsAside({ event }: EventDetailsAsideProps) {
  return (
    <aside className="border border-slate-200 bg-white shadow-lg">
      {/* Magnitude Banner */}
      <div className="bg-gradient-to-r from-red-950 via-red-800 to-red-700 p-8 space-y-6 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-red-200">
          EARTHQUAKE EVENT
        </p>
        <h2 className="mt-3 text-6xl font-black">
          {event.magnitude.toFixed(1)}
        </h2>
        <p className="mt-3 text-red-100 font-medium">
          {event.place}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-3 p-6">
        <Info label="Country" value={countryOf(event.place)} />
        <Info
          label="Coordinates"
          value={`${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`}
        />
        <Info
          label="Depth"
          value={`${event.depth.toFixed(1)} km`}
        />
        <Info
          label="UTC Time"
          value={fmtDate(event.time, "UTC")}
        />
        <Info
          label="Local Time"
          value={fmtDate(event.time)}
        />
        <Info
          label="Magnitude Type"
          value={event.magType}
        />
        <Info
          label="Alert Level"
          value={event.alert || "None"}
        />
        <Info
          label="Tsunami"
          value={event.tsunami ? "Yes" : "No"}
        />
        <Info
          label="Significance"
          value={String(event.sig)}
        />
        <Info
          label="Felt Reports"
          value={String(event.felt ?? "Not Reported")}
        />
        <Info
          label="Status"
          value={event.status}
        />
      </div>

      <div className="border-t border-slate-200 p-6">
        <a
          href={event.url}
          target="_blank"
          rel="noreferrer"
          className="block bg-red-700 px-5 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-800"
        >
          View Record
        </a>
      </div>
    </aside>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3">
      <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="text-right text-sm font-black text-slate-900">
        {value}
      </span>
    </div>
  );
}
