import React from 'react';
import { Earthquake } from '../../types';
import { alertStyle, depthStyle, magnitudeStyle } from './colors';
import { countryOf, fmtDate } from './data';
import Badge from './Badge';
import EmptyState from './EmptyState';

export default function DataTable({
  events,
  onSelect,
}: {
  events: Earthquake[];
  onSelect: (event: Earthquake) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl backdrop-blur">
      <div className="border-b border-red-100 bg-gradient-to-r from-red-950 via-red-800 to-orange-700 px-6 py-5">
        <h2 className="text-2xl font-black text-white">Earthquake Records</h2>
        <p className="mt-1 text-sm text-red-100">Sortable source-ready records with colored risk factors.</p>
      </div>

      <div className="max-h-[650px] overflow-auto">
        <table className="min-w-full text-left">
          <thead className="sticky top-0 z-10 bg-red-50 shadow-sm">
            <tr className="text-xs font-black uppercase tracking-[0.14em] text-red-900">
              {['Magnitude', 'Location', 'Country', 'Depth', 'Time (UTC)', 'Alert', 'Tsunami', 'Status'].map((head) => (
                <th key={head} className="px-6 py-4">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event, index) => (
              <tr
                key={event.id}
                onClick={() => onSelect(event)}
                className={`cursor-pointer transition hover:bg-red-50 ${index % 2 ? 'bg-slate-50/70' : 'bg-white'}`}
              >
                <td className="px-6 py-4">
                  <Badge className={magnitudeStyle(event.magnitude)}>M {event.magnitude.toFixed(1)}</Badge>
                </td>
                <td className="max-w-md px-6 py-4 font-bold text-slate-950">{event.place}</td>
                <td className="px-6 py-4 text-slate-600">{countryOf(event.place)}</td>
                <td className="px-6 py-4">
                  <Badge className={depthStyle(event.depth)}>{event.depth.toFixed(1)} km</Badge>
                </td>
                <td className="px-6 py-4 text-slate-600">{fmtDate(event.time, 'UTC')}</td>
                <td className="px-6 py-4">
                  <Badge className={alertStyle(event.alert)}>{event.alert ?? 'None'}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={event.tsunami ? 'border-red-600 bg-red-100 text-red-800' : 'border-green-600 bg-green-100 text-green-800'}>
                    {event.tsunami ? 'Yes' : 'No'}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">{event.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!events.length && (
        <div className="p-10">
          <EmptyState title="No Historical Records" text="No earthquake records were found for the selected filters." />
        </div>
      )}
    </div>
  );
}
