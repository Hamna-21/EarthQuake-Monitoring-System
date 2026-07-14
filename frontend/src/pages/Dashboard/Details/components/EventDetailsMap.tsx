import React from 'react';
import { Earthquake } from '../../../../types';
import MapCanvas from '../../../../components/dashboard/MapCanvas';

interface EventDetailsMapProps {
  event: Earthquake;
  nearby: Earthquake[];
  setSelectedId: (id: string) => void;
}

export default function EventDetailsMap({ event, nearby, setSelectedId }: EventDetailsMapProps) {
  return (
    <div className="border border-slate-200 bg-white shadow-lg">
      <div className="border-b border-slate-200 px-6 py-5">
        <h3 className="text-2xl font-black text-slate-900">
          Location
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Map displaying the selected Earthquake and nearby
          Seismic activity.
        </p>
      </div>

      <MapCanvas
        events={[event, ...nearby]}
        selectedId={event.id}
        onSelect={(e) => setSelectedId(e.id)}
      />
    </div>
  );
}
