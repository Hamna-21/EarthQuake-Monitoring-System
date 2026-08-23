import { lazy, Suspense } from 'react';
import HeroContent from '@/features/home/components/hero/HeroContent';
import HeroOverlay from '@/features/home/components/hero/HeroOverlay';
import HeroStats from '@/features/home/components/hero/HeroStats';

const EarthScene = lazy(() => import('@/features/home/components/earth/EarthScene'));

interface HomeHeroProps {
  earthquakesCount: number;
  onExecuteSearch: () => void;
}

/** Renders or coordinates home hero for this frontend module. */
export default function HomeHero({
  earthquakesCount,
  onExecuteSearch,
}: HomeHeroProps) {
  return (
    <header className="relative z-10 min-h-[70vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}><EarthScene /></Suspense>
      </div>

      <HeroOverlay />

      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <HeroContent onExecuteSearch={onExecuteSearch} />
          <HeroStats earthquakesCount={earthquakesCount} />
        </div>
      </div>
    </header>
  );
}
/** Composes the landing-page hero scene, messaging, actions, and statistics. */
