import HeroBadge from '@/features/home/components/hero/HeroBadge';
import HeroButtons from '@/features/home/components/hero/HeroButtons';

interface HeroContentProps {
  onExecuteSearch: () => void;
}

/** Renders or coordinates hero content for this frontend module. */
export default function HeroContent({ onExecuteSearch }: HeroContentProps) {
  return (
    <>
      <HeroBadge />
      <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
        Earthquake Monitoring System
        <span className="mt-3 block bg-gradient-to-b from-white via-cyan-100 to-red-200 bg-clip-text text-transparent">
          Seismic Activity
        </span>
      </h1>
      <p className="mx-auto mt-7 max-w-xl text-lg font-light leading-8 text-cyan-50/80 md:text-xl">
        AI-powered earthquake monitoring with real-time data, global epicenter
        tracking, and earthquake safety information.
      </p>
      <HeroButtons onExecuteSearch={onExecuteSearch} />
    </>
  );
}
/** Provides the headline and supporting copy for the landing-page hero. */
