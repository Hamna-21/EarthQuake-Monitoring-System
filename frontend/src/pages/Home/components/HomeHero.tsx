import React from 'react';
import { Activity } from 'lucide-react';

interface HomeHeroProps {
  earthquakesCount: number;
  onExecuteSearch: () => void;
}

export default function HomeHero({ earthquakesCount, onExecuteSearch }: HomeHeroProps) {
  return (
    <header className="relative z-10 flex min-h-[78vh] flex-col items-center justify-center px-6 text-center">
      {/* Small Badge */}
      <div className="mb-6 flex items-center gap-2 rounded-none border border-red-500/20 bg-red-500/10 px-5 py-2 backdrop-blur-xl shadow-lg shadow-red-900/20">
        <Activity className="h-4 w-4 text-red-400 animate-pulse" />
        <span className="text-xs uppercase tracking-[0.35em] text-red-200 font-semibold">
          Global Seismic Intelligence
        </span>
      </div>

      {/* Main Heading */}
      <h1 className="max-w-6xl text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
        Monitor Earth's
        <br />
        <span className="bg-gradient-to-b from-white via-gray-300 to-red-200 bg-clip-text text-transparent">
          Seismic Activity
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-8 max-w-3xl text-lg font-light italic leading-8 text-red-100/75 md:text-xl">
        GeoPulse delivers real-time earthquake monitoring, historical seismic
        insights, tectonic movement analysis, and interactive visualization
        from trusted global geological data sources.
      </p>

      {/* Buttons */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
        <button
          onClick={onExecuteSearch}
          className="rounded-none bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-white shadow-2xl shadow-red-700/40 transition-all duration-300 hover:scale-105 hover:shadow-red-500/60 cursor-pointer"
        >
          Explore Live Data
        </button>

        <button
          onClick={() =>
            document
              .getElementById("dashboard-deck")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="rounded-none border border-red-500/30 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-red-100 backdrop-blur-xl transition-all duration-300 hover:border-red-400 hover:bg-red-500/10 cursor-pointer"
        >
          View Dashboard
        </button>
      </div>

      {/* Live Statistics */}
      <div className="mt-20 grid w-full max-w-6xl grid-cols-2 gap-5 md:grid-cols-4">
        <div className="rounded-none border border-red-900/20 bg-white/5 p-6 backdrop-blur-xl shadow-lg">
          <h3 className="text-4xl font-bold text-red-400">
            {earthquakesCount}
          </h3>
          <p className="mt-2 text-sm uppercase tracking-widest text-red-100/70">
            Live Events
          </p>
        </div>

        <div className="rounded-none border border-red-900/20 bg-white/5 p-6 backdrop-blur-xl shadow-lg">
          <h3 className="text-4xl font-bold text-orange-300">
            1990–2026
          </h3>
          <p className="mt-2 text-sm uppercase tracking-widest text-red-100/70">
            Historical Archive
          </p>
        </div>

        <div className="rounded-none border border-red-900/20 bg-white/5 p-6 backdrop-blur-xl shadow-lg">
          <h3 className="text-4xl font-bold text-red-300">
            24/7
          </h3>
          <p className="mt-2 text-sm uppercase tracking-widest text-red-100/70">
            Monitoring
          </p>
        </div>

        <div className="rounded-none border border-red-900/20 bg-white/5 p-6 backdrop-blur-xl shadow-lg">
          <h3 className="text-4xl font-bold text-orange-400">
            Global
          </h3>
          <p className="mt-2 text-sm uppercase tracking-widest text-red-100/70">
            Coverage
          </p>
        </div>
      </div>
    </header>
  );
}
