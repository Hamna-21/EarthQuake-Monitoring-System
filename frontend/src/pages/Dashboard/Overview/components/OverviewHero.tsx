import React from 'react';

export default function OverviewHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 p-8 text-white shadow-2xl">
      <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-red-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-300">
        Dashboard / Overview
      </p>
      <h1 className="relative mt-4 text-5xl font-black">Global Seismic Intelligence</h1>
      <p className="mt-4 max-w-3xl text-lg font-light text-red-100">
        A live emergency operations view for worldwide seismic activity, risk,
        alerts, trends, and response-ready intelligence.
      </p>
    </section>
  );
}
