import EarlyWarningSigns from '@/features/dashboard/prediction/components/EarlyWarningSigns';
import SafetyTabs from '@/features/dashboard/prediction/components/SafetyTabs';
import WorldActivity from '@/features/dashboard/prediction/components/WorldActivity';

/** Renders or coordinates prediction view for this frontend module. */
export default function PredictionView() {
  return <div className="space-y-4 pb-4"><WorldActivity /><EarlyWarningSigns /><SafetyTabs /></div>;
}
/** Presents prediction inputs, calculated risk information, and guidance. */
