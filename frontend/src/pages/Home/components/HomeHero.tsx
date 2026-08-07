import EarthScene from './earth/EarthScene';
import HeroContent from './hero/HeroContent';
import HeroOverlay from './hero/HeroOverlay';
import HeroStats from './hero/HeroStats';

interface HomeHeroProps {
  earthquakesCount: number;
  onExecuteSearch: () => void;
}

export default function HomeHero({
  earthquakesCount,
  onExecuteSearch,
}: HomeHeroProps) {
  return (
    <header className="relative z-10 min-h-[78vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <EarthScene />
      </div>

      <HeroOverlay />

      <div className="relative z-10 mx-auto flex min-h-[78vh] w-full max-w-7xl items-center justify-center px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <HeroContent onExecuteSearch={onExecuteSearch} />
          <HeroStats earthquakesCount={earthquakesCount} />
        </div>
      </div>
    </header>
  );
}