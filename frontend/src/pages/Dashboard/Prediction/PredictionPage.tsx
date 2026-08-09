import type { DashboardProps } from '../../../components/dashboard/types';
import PredictionView from './components/PredictionView';
import PageBackButton from '../../../components/dashboard/PageBackButton';

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