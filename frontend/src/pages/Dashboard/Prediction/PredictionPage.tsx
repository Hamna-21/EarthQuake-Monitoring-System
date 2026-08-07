import { DashboardProps } from '../../../components/dashboard/types';
import PredictionView from './components/PredictionView.tsx';
import { usePredictionPageState } from './components/usePredictionPageState.tsx';

export default function PredictionPage({ earthquakes, openPage }: DashboardProps) {
  return <PredictionView {...usePredictionPageState(earthquakes)} onClose={() => openPage('overview')} />;
}
