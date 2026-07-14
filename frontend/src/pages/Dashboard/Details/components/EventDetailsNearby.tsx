import React from 'react';
import { Earthquake } from '../../../../types';
import { EventList } from '../../../../components/dashboard/ui';

interface EventDetailsNearbyProps {
  nearby: Earthquake[];
  setSelectedId: (id: string) => void;
}

export default function EventDetailsNearby({ nearby, setSelectedId }: EventDetailsNearbyProps) {
  return (
    <div className="border border-slate-200 bg-white shadow-lg">
      <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            Nearby Earthquakes
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Recent seismic events detected near the selected epicenter.
          </p>
        </div>

        <span className="bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
          {nearby.length} Events
        </span>
      </div>

      <div className="p-6">
        <EventList
          events={nearby}
          onSelect={(e) => setSelectedId(e.id)}
        />
      </div>
    </div>
  );
}
