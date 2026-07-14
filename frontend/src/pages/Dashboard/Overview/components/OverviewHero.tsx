import React from 'react';

export default function OverviewHero() {
  return (
    <section className="relative overflow-hidden rounded-none bg-gradient-to-r from-slate-950 via-red-900 to-rose-950 p-8 text-white shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-red-500/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl"></div>

      {/* Content */}
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-300">
        LIVE MONITORING
      </p>

      <h1 className="mt-4 text-5xl font-black">
        Global Seismic Activity
      </h1>

      <p className="mt-4 max-w-3xl text-lg font-light text-red-100">
        Monitor worldwide earthquakes, analyze seismic trends, and receive
        real-time alerts.
      </p>
    </section>
  );
}
