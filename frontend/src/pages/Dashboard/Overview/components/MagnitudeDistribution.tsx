import React from 'react';
import { Earthquake } from '../../../../types';

interface MagnitudeDistributionProps {
  earthquakes: Earthquake[];
}

export default function MagnitudeDistribution({ earthquakes }: MagnitudeDistributionProps) {
  return (
    <div className="border border-red-100 bg-white shadow-lg">
      <div className="border-b border-red-100 bg-red-50 px-6 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-700">
          SEISMIC ANALYSIS
        </p>

        <h2 className="mt-1 text-2xl font-black text-slate-900">
          Magnitude Distribution
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Earthquake events grouped by magnitude severity.
        </p>
      </div>

      <div className="space-y-3 p-5">
        {[
          ["Minor (0–3)", 0, 3],
          ["Light (3–5)", 3, 5],
          ["Moderate (5–7)", 5, 7],
          ["Major (7+)", 7, 10],
        ].map(([label, min, max]) => {
          const count = earthquakes.filter(
            (e) =>
              e.magnitude >= Number(min) &&
              e.magnitude < Number(max)
          ).length;

          return (
            <div
              key={label}
              className="flex items-center justify-between border border-slate-200 px-4 py-4 transition hover:border-red-300 hover:bg-red-50"
            >
              <span className="font-semibold text-slate-700">
                {label}
              </span>

              <span className="bg-red-800 px-3 py-1 text-lg font-black text-white">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
