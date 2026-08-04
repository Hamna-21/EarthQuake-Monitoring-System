import HeroBadge from './HeroBadge';
import HeroButtons from './HeroButtons';

interface HeroContentProps {
  onExecuteSearch: () => void;
}

export default function HeroContent({ onExecuteSearch }: HeroContentProps) {
  return (
    <>
      <HeroBadge />
      <h1 className="text-5xl font-black leading-none tracking-normal text-white md:text-7xl lg:text-8xl">
        GeoPulse
        <span className="mt-3 block bg-gradient-to-b from-white via-cyan-100 to-red-200 bg-clip-text text-transparent">
          Seismic Activity
        </span>
      </h1>
      <p className="mx-auto mt-7 max-w-xl text-lg font-light leading-8 text-cyan-50/80 md:text-xl">
        AI-powered earthquake monitoring with real-time data, global epicenter
        tracking, and safety-focused seismic intelligence.
      </p>
      <HeroButtons onExecuteSearch={onExecuteSearch} />
    </>
  );
}
