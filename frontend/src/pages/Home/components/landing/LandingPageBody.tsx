import { Earthquake } from '../../../../types';
import AnalyticsPreview from './AnalyticsPreview';
import DashboardPreview from './DashboardPreview';
import FaqSection from './FaqSection';
import FinalCta from './FinalCta';
import GeoBotSection from './GeoBotSection';
import LandingStats from './LandingStats';
import PremiumFeatureGrid from './PremiumFeatureGrid';
import SafetyPreview from './SafetyPreview';
import WorkflowSection from './WorkflowSection';

interface LandingPageBodyProps {
  earthquakes: Earthquake[];
  onLaunch: () => void;
}

export default function LandingPageBody({ earthquakes, onLaunch }: LandingPageBodyProps) {
  return (
    <main id="dashboard-deck" className="relative z-10">
      <LandingStats earthquakes={earthquakes} />
      <PremiumFeatureGrid />
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
