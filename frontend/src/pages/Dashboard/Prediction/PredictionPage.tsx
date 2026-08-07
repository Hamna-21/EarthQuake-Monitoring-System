import { DashboardProps } from '../../../components/dashboard/types';
import PredictionView from './components/PredictionView';
import { usePredictionPageState } from './components/usePredictionPageState';

export default function PredictionPage({ earthquakes, openPage }: DashboardProps) {
  return <PredictionView {...usePredictionPageState(earthquakes)} onClose={() => openPage('overview')} />;
}
