import { SlidersHorizontal } from 'lucide-react';
import { PanelHeader } from '@/features/dashboard/components/panelstat';

export default function MapControlPanelHeader() {
  return <PanelHeader icon={<SlidersHorizontal className="h-3.5 w-3.5 text-white" />} accent="from-cyan-400 via-blue-500 to-violet-500" title="Map Controls" />;
}
