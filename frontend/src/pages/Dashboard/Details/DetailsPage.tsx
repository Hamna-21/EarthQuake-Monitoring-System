import React from 'react';
import { haversineKm } from '../../../components/dashboard/data';
import { DashboardProps } from '../../../components/dashboard/types';
import EventDetailsAside from './components/EventDetailsAside';
import EventDetailsMap from './components/EventDetailsMap';
import EventDetailsNearby from './components/EventDetailsNearby';

export default function DetailsPage({ earthquakes, selectedEvent, setSelectedId }: DashboardProps) {
  const event = selectedEvent || earthquakes[0] || null;
  const nearby = event
    ? earthquakes
        .filter((e) => e.id !== event.id)
        .map((e) => ({ e, d: haversineKm({ lat: event.latitude, lon: event.longitude }, { lat: e.latitude, lon: e.longitude }) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 5)
        .map((x) => x.e)
    : [];
  return (
    <>
      <section className="relative overflow-hidden rounded-none bg-gradient-to-r from-[#3b0a0a] via-[#651010] to-[#8b1e1e] px-10 py-12 text-white shadow-xl">
        {/* Background Effects */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-500/20 blur-3xl"></div>
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
        </div>

        <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
          {/* Left */}
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.35em] text-red-200">
              EARTHQUAKE EVENT ANALYSIS
            </p>
            <h1 className="text-5xl font-black leading-tight">
               Event Record
            </h1>
            <p className="mt-5 text-lg leading-8 text-red-100">
              Explore comprehensive information for the selected Earthquake
            </p>
          </div>
        </div>
      </section>
      
      {!event ? (
        <div className="flex h-[450px] items-center justify-center border border-slate-200 bg-white text-slate-500 shadow-sm">
          <div className="text-center">
            <h3 className="text-2xl font-black text-slate-800">
              No Earthquake Selected
            </h3>
            <p className="mt-3 text-sm text-slate-500">
              Select an earthquake from the Live Feed, Map, or History page to
              inspect its complete details.
            </p>
          </div>
        </div>
      ) : (
        <section className="grid gap-5 xl:grid-cols-[400px_1fr]">
          {/* LEFT PANEL */}
          <EventDetailsAside event={event} />

          {/* RIGHT PANEL */}
          <div className="space-y-11">
            {/* MAP */}
            <EventDetailsMap event={event} nearby={nearby} setSelectedId={setSelectedId} />

            {/* Nearby */}
            <EventDetailsNearby nearby={nearby} setSelectedId={setSelectedId} />
          </div>
        </section>
      )}
    </>
  );
}