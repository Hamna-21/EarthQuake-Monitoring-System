import React from 'react';

export default function HomeFeatures() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-none border border-red-900/20 bg-gradient-to-br from-[#3b1715] to-[#23100f] p-8 backdrop-blur-xl">
        <h3 className="mb-3 text-xl font-bold leading-tight text-red-300">
          Earthquake Monitoring
        </h3>
        <p className="font-light italic text-sm leading-7 text-red-100/70">
          Monitor seismic activity around the globe with real-time
          telemetry and historical earthquake records.
        </p>
      </div>

      <div className="rounded-none border border-red-900/20 bg-gradient-to-br from-[#3b1715] to-[#23100f] p-8 backdrop-blur-xl">
        <h3 className="mb-3 text-xl font-bold leading-tight text-orange-300">
          Intelligent Analytics
        </h3>
        <p className="font-light italic text-sm leading-7 text-red-100/70">
          Analyze earthquake magnitude, depth, frequency and regional
          activity through interactive visualizations.
        </p>
      </div>

      <div className="rounded-none border border-red-900/20 bg-gradient-to-br from-[#3b1715] to-[#23100f] p-8 backdrop-blur-xl">
        <h3 className="mb-3 text-xl font-bold leading-tight text-red-300">
          Emergency Preparedness
        </h3>
        <p className="font-light italic text-sm leading-7 text-red-100/70">
          Stay informed with early warnings and preparedness guidelines to
          improve safety during seismic events.
        </p>
      </div>
    </section>
  );
}
