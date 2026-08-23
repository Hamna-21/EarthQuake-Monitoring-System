import { useEffect, useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';

import PremiumCard from '@/features/home/components/landing/PremiumCard';
import SectionShell from '@/features/home/components/landing/SectionShell';

const facts = [
  'Earth experiences around 20,000 earthquakes every year.',
  'The Pacific Ring of Fire produces nearly 80% of earthquakes.',
  'Tectonic plates move almost as fast as fingernails grow.',
  'Most earthquakes occur beneath the ocean floor.',
];

const answers: Record<string, string> = {
  Magnitude:
    'Magnitude measures earthquake energy. Each step higher releases much more energy.',
  Depth:
    'Depth shows how far below the surface the earthquake began.',
  Safety:
    'Move away from glass, drop, cover, and hold until shaking stops.',
  Nearby:
    'GeoBot can help users understand nearby earthquake activity from the dashboard.',
};

/** Demonstrates GeoBot with rotating earthquake facts and clickable example answers. */
export default function GeoBotSection() {
  const [factIndex, setFactIndex] = useState(0);
  const [message, setMessage] = useState(
    "Hello, I'm GeoBot. I help explain earthquake information and safety steps."
  );

  // Rotate the educational fact independently of the selected example answer, and clean up the timer on unmount.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setFactIndex((current) => (current + 1) % facts.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <SectionShell
      eyebrow="Meet GeoBot"
      title="A calm AI companion for seismic questions."
      subtitle="GeoBot provides guidance, explanations, and quick actions in plain language."
    >
      <div className="grid items-center gap-4 lg:grid-cols-[0.75fr_1.25fr]">
        {/* GeoBot visual */}
        <div className="relative mx-auto grid h-48 w-48 place-items-center md:h-56 md:w-56">
          <div className="absolute inset-3 animate-pulse rounded-full bg-cyan-400/10 blur-2xl" />

          <div className="relative w-28 border border-cyan-200/30 bg-slate-950/80 p-3 shadow-xl shadow-cyan-950/40 backdrop-blur-xl md:w-32">
            <div className="mx-auto grid h-14 w-16 place-items-center bg-cyan-300/10">
              <Bot className="h-9 w-9 animate-bounce text-cyan-100 md:h-10 md:w-10" />
            </div>

            <div className="mt-2 flex justify-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-200" />
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-200" />
            </div>
          </div>
        </div>

        {/* Chat card */}
        <PremiumCard className="w-full max-w-xl">
          <div className="flex items-center gap-2 text-cyan-100">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.22em]">
              GeoBot
            </span>
          </div>

          <p className="mt-3 border border-white/10 bg-black/20 p-3 text-sm leading-6 text-slate-100">
            {message}
          </p>

          <p className="mt-3 text-xs font-semibold leading-5 text-red-100">
            {facts[factIndex]}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {Object.keys(answers).map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setMessage(answers[label])}
                className="border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white transition hover:border-cyan-200/40 hover:bg-cyan-300/10"
              >
                {label}
              </button>
            ))}
          </div>
        </PremiumCard>
      </div>
    </SectionShell>
  );
}
