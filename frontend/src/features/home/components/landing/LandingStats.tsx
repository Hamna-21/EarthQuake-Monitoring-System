import {
  Activity,
  Globe2,
  Radio,
  TrendingUp,
} from 'lucide-react';

import { Earthquake } from '@/types';
import {
  averageMagnitude,
  mostActiveCountry,
  strongest,
} from '@/features/home/components/landing/landingUtils';

import SectionShell from '@/features/home/components/landing/SectionShell';

interface LandingStatsProps {
  earthquakes: Earthquake[];
}

export default function LandingStats({
  earthquakes,
}: LandingStatsProps) {
  const top = strongest(earthquakes);

  const stats = [
    {
      label: "Today's Earthquakes",
      value: earthquakes.length,
      icon: Activity,
      style:
        'border-sky-200/15 bg-sky-300/[0.06] text-sky-100',
      glow:
        'bg-sky-300/10',
    },
    {
      label: 'Strongest Magnitude',
      value: top ? top.magnitude.toFixed(1) : '0.0',
      icon: TrendingUp,
      style:
        'border-rose-200/15 bg-rose-300/[0.06] text-rose-100',
      glow:
        'bg-rose-300/10',
    },
    {
      label: 'Most Active Region',
      value: mostActiveCountry(earthquakes),
      icon: Globe2,
      style:
        'border-violet-200/15 bg-violet-300/[0.06] text-violet-100',
      glow:
        'bg-violet-300/10',
    },
    {
      label: 'Average Magnitude',
      value: averageMagnitude(earthquakes),
      icon: Radio,
      style:
        'border-teal-200/15 bg-teal-300/[0.06] text-teal-100',
      glow:
        'bg-teal-300/10',
    },
  ];

  return (
    <SectionShell
      eyebrow="Live Global Activity"
      title="A real-time command view of Earth."
      subtitle="GeoPulse turns incoming seismic records into readable operational signals."
    >
      {/* COMPACT GLASS STATS */}
      <div className="grid max-w-5xl grid-cols-2 gap-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, style, glow }) => (
          <div
            key={label}
            className={`relative overflow-hidden border px-3 py-2.5 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 ${style}`}
          >
            {/* Soft glass glow */}
            <div
              className={`pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full blur-2xl ${glow}`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.06]">
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              </div>

              <p className="mt-2 text-lg font-black text-white">
                {value}
              </p>

              <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.12em] opacity-75">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MONITORING STATUS */}
      <div className="mt-2 flex max-w-5xl items-center gap-2 border border-emerald-200/15 bg-emerald-300/[0.05] px-3 py-2 text-xs backdrop-blur-2xl">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />

        <span className="text-slate-400">
          Monitoring Status
        </span>

        <span className="font-semibold text-emerald-100">
          Active global seismic watch
        </span>
      </div>
    </SectionShell>
  );
}