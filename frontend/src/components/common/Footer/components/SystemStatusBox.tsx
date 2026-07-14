import React from 'react';

export default function SystemStatusBox() {
  return (
    <div>
      <h3 className="mb-5 text-lg font-bold text-white">
        System Status
      </h3>
      <div className="rounded-none border border-red-900/30 bg-white/5 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="font-black leading-none text-white">
            Live Monitoring Active
          </span>
        </div>
        <p className="font-light italic mt-4 text-sm leading-6 text-red-100/60">
          Connected to global seismic monitoring networks.
        </p>
      </div>
    </div>
  );
}
