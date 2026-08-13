import type { DashboardProps } from '@/features/dashboard/types';
import PredictionView from '@/features/dashboard/prediction/components/PredictionView';
import PageBackButton from '@/features/dashboard/components/PageBackButton';

export default function PredictionPage({ openPage }: DashboardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <PageBackButton label="Close" onClick={() => openPage('overview')} />
      </div>
      <PredictionView />
    </div>
  );
}