import type { DashboardProps } from '@/features/dashboard/types';
import PredictionView from '@/features/dashboard/prediction/components/PredictionView';
import BackButton from '@/features/dashboard/components/common/BackButton';

/** Hosts the prediction/safety view and delegates its interactive content to PredictionView. */
export default function PredictionPage({ openPage }: DashboardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <BackButton label="Close" onClick={() => openPage('overview')} />
      </div>
      <PredictionView />
    </div>
  );
}
