import { useEffect, useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import PremiumCard from './PremiumCard';
import SectionShell from './SectionShell';

const facts = [
  'Earth experiences around 20,000 earthquakes every year.',
  'The Pacific Ring of Fire produces nearly 80% of earthquakes.',
  'Tectonic plates move almost as fast as fingernails grow.',
  'Most earthquakes occur beneath the ocean floor.',
];

const answers: Record<string, string> = {
  Magnitude: 'Magnitude measures earthquake energy. Each step higher releases much more energy.',
  Depth: 'Depth shows how far below the surface the earthquake began.',
  Safety: 'Move away from glass, drop, cover, and hold until shaking stops.',
  Nearby: 'GeoPulse can guide users toward nearby earthquake awareness from the dashboard.',
};

export default function GeoBotSection() {
  const [factIndex, setFactIndex] = useState(0);
  const [message, setMessage] = useState("Hello, I'm GeoBot. I monitor seismic activity 24 hours a day.");

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
      subtitle="GeoBot adds guidance, explanations, and quick actions without making the interface feel crowded."
    >
      <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative mx-auto grid h-72 w-72 place-items-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative w-40 border border-cyan-200/30 bg-slate-950/80 p-5 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
            <div className="mx-auto grid h-20 w-24 place-items-center bg-cyan-300/10">
              <Bot className="h-14 w-14 animate-bounce text-cyan-100" />
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-200" />
              <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-200" />
            </div>
          </div>
        </div>
        <PremiumCard>
          <div className="flex items-center gap-3 text-cyan-100">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-[0.24em]">GeoBot Chat</span>
          </div>
          <p className="mt-6 border border-white/10 bg-black/20 p-5 leading-8 text-slate-100">
            {message}
          </p>
          <p className="mt-4 text-sm font-semibold text-red-100">{facts[factIndex]}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {Object.keys(answers).map((label) => (
              <button
                key={label}
                onClick={() => setMessage(answers[label])}
                className="border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-cyan-200/40 hover:bg-cyan-300/10"
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
