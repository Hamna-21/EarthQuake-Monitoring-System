import EarlyWarningSigns from './EarlyWarningSigns';
import SafetyTabs from './SafetyTabs';
import WorldActivity from './WorldActivity';

export default function PredictionView() {
  return <div className="space-y-4 pb-4"><WorldActivity /><EarlyWarningSigns /><SafetyTabs /></div>;
}
