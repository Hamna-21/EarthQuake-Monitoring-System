import { Earthquake } from '@/types';
import AnalyticsPreview from '@/features/home/components/landing/AnalyticsPreview';
import DashboardPreview from '@/features/home/components/landing/DashboardPreview';
import FaqSection from '@/features/home/components/landing/FaqSection';
import FinalCta from '@/features/home/components/landing/FinalCta';
import GeoBotSection from '@/features/home/components/landing/GeoBotSection';
import LandingStats from '@/features/home/components/landing/LandingStats';
import PremiumFeatureGrid from '@/features/home/components/landing/PremiumFeatureGrid';
import SafetyPreview from '@/features/home/components/landing/SafetyPreview';
import WorkflowSection from '@/features/home/components/landing/WorkflowSection';

interface LandingPageBodyProps {
  earthquakes: Earthquake[];
  onLaunch: () => void;
}

export default function LandingPageBody({ earthquakes, onLaunch }: LandingPageBodyProps) {
  return (
    <main id="dashboard-deck" className="relative z-10">
      <LandingStats earthquakes={earthquakes} />  
      <WorkflowSection />
      <DashboardPreview />
      <AnalyticsPreview earthquakes={earthquakes} />
      <SafetyPreview />
      <GeoBotSection />
      <FaqSection />
      <FinalCta onLaunch={onLaunch} />
    </main>
  );
}
