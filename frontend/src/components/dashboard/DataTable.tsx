import React from 'react';
import { Earthquake } from '../../types';
import { countryOf, fmtDate } from './data';
import EmptyState from './EmptyState';

export default function DataTable({
  events,
  onSelect,
}: {
  events: Earthquake[];
  onSelect: (event: Earthquake) => void;
}) {
  return (
    <div className="overflow-hidden border border-red-100 bg-white shadow-lg">
      <div className="border-b border-red-100 bg-gradient-to-r from-red-900 to-red-800 px-6 py-4">
        <h2 className="text-2xl font-black text-white">
         Earthquake Records
        </h2>

        <p className="mt-1 text-sm text-red-100">
          Official Seismic events with magnitude, depth, tsunami and alert information.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-red-50">
            <tr className="text-xs font-bold uppercase tracking-[0.15em] text-red-800">
              <th className="px-6 py-4">Magnitude</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Country</th>
              <th className="px-6 py-4">Depth</th>
              <th className="px-6 py-4">Time (UTC)</th>
              <th className="px-6 py-4">Alert</th>
              <th className="px-6 py-4">Tsunami</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {events.map((e) => {
              const magColor =
                e.magnitude >= 7
                  ? "bg-red-900"
                  : e.magnitude >= 6
                  ? "bg-red-700"
                  : e.magnitude >= 5
                  ? "bg-orange-600"
                  : "bg-yellow-500";

              return (
                <tr
                  key={e.id}
                  onClick={() => onSelect(e)}
                  className="cursor-pointer border-b border-slate-200 transition hover:bg-red-50"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`${magColor} px-3 py-2 font-black text-white`}
                    >
                      M {e.magnitude.toFixed(1)}
                    </span>
                  </td>

                  <td className="max-w-md px-6 py-4 font-semibold text-slate-900">
                    {e.place}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {countryOf(e.place)}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {e.depth.toFixed(1)} km
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {fmtDate(e.time, "UTC")}
                  </td>

                  <td className="px-6 py-4">
                    <span className="border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold uppercase text-red-700">
                      {e.alert ?? "None"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {e.tsunami ? (
                      <span className="bg-red-700 px-3 py-1 text-xs font-bold text-white">
                        YES
                      </span>
                    ) : (
                      <span className="bg-green-700 px-3 py-1 text-xs font-bold text-white">
                        NO
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {e.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!events.length && (
        <div className="p-10">
          <EmptyState
            title="No Historical Records"
            text="No  Earthquake records were found for the selected filters."
          />
        </div>
      )}
    </div>
  );
}
