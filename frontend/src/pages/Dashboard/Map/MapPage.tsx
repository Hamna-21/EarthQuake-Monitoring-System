import React, { useMemo, useState } from 'react';
import { Earthquake } from '../../../types';
import MapCanvas from '../../../components/dashboard/MapCanvas';
import { fmtDate } from '../../../components/dashboard/data';
import { DashboardProps } from '../../../components/dashboard/types';
import { PageTitle, RefreshNote } from '../../../components/dashboard/Shell';

export default function MapPage({ earthquakes, selectedEvent, setSelectedId, isLoading, dataError }: DashboardProps) {
  const [minMag, setMinMag] = useState(0);
  const [layer, setLayer] = useState('markers');
  const events = useMemo(() => earthquakes.filter((e) => e.magnitude >= minMag), [earthquakes, minMag]);
  const select = (event: Earthquake) => setSelectedId(event.id);
  return (
    <>
    <section className="relative overflow-hidden border border-red-900/20 bg-gradient-to-r from-red-950 via-red-900 to-rose-800 px-8 py-8 text-white shadow-xl">

    <div className="absolute right-0 top-0 h-64 w-64 bg-red-500/10 blur-3xl"></div>

    <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-100">
        LIVE MAP
    </p>

    <h1 className="mt-3 text-5xl font-black">
        Global Earthquake Map
    </h1>

    <p className="mt-7 max-w-2xl text-red-100">
        Explore worldwide earthquake activity using real-time  data.
        Filter events by magnitude and inspect detailed seismic information
        directly from the interactive world map.
    </p>

</section>

      <RefreshNote isLoading={isLoading} error={dataError} />
      <section className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="flex min-w-64 flex-1 items-center gap-3 text-sm font-bold text-slate-600">Minimum magnitude
          <input type="range" min="0" max="9" step="0.1" value={minMag} onChange={(e) => setMinMag(Number(e.target.value))} className="flex-1 accent-red-700" />
          <span className="text-slate-950">{minMag.toFixed(1)}</span>
        </label>
        <select value={layer} onChange={(e) => setLayer(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold">
          <option value="markers">Markers</option>
          <option value="heat">Heat summary</option>
          <option value="timeline">Timeline focus</option>
        </select>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <MapCanvas events={events} selectedId={selectedEvent?.id} onSelect={select} />
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-700">Selected Earthquake</p>
          {selectedEvent ? (
            <div className="mt-4 space-y-3">
              <h3 className="text-2xl font-black text-slate-950">M {selectedEvent.magnitude.toFixed(1)}</h3>
              <p className="font-semibold text-slate-700">{selectedEvent.place}</p>
              <Info label="Coordinates" value={`${selectedEvent.latitude.toFixed(3)}, ${selectedEvent.longitude.toFixed(3)}`} />
              <Info label="Depth" value={`${selectedEvent.depth.toFixed(1)} km`} />
              <Info label="Time UTC" value={fmtDate(selectedEvent.time, 'UTC')} />
              <Info label="Alert" value={selectedEvent.alert || 'none'} />
              <Info label="Tsunami" value={selectedEvent.tsunami ? 'yes' : 'no'} />
            </div>
          ) : <p className="mt-4 text-sm text-slate-500">Click on Earthquake to inspect the event.</p>}
          <p className="mt-6 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">{layer}</p>
        </aside>
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3 text-sm"><span className="font-bold text-slate-500">{label}</span><span className="text-right font-black text-slate-900">{value}</span></div>;
}
