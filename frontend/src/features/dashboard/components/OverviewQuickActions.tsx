import { Bell, ChevronRight, LocateFixed, Siren } from 'lucide-react';
import { Button } from 'antd';
import { DashboardPage } from '@/features/dashboard/types';

const ACTIONS = [
  { page: 'nearby' as DashboardPage, icon: LocateFixed, label: 'Nearby', tone: 'text-cyan-200 border-cyan-300/25 bg-cyan-500/10 hover:bg-cyan-500/20' },
  { page: 'prediction' as DashboardPage, icon: Siren, label: 'Prediction', tone: 'text-amber-100 border-amber-300/25 bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-400/10 hover:from-rose-500/20 hover:to-amber-400/20' },
  { page: 'alerts' as DashboardPage, icon: Bell, label: 'Alerts', tone: 'text-rose-200 border-rose-300/25 bg-rose-500/10 hover:bg-rose-500/20' },
];

/** Renders or coordinates overview quick actions for this frontend module. */
export default function OverviewQuickActions({ openPage }: { openPage: (page: DashboardPage) => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      {ACTIONS.map(({ page, icon: Icon, label, tone }) => (
        <Button
          key={page}
          type="default"
          onClick={() => openPage(page)}
          className={`overview-action overview-action--${page} ${tone}`}
        >
          <Icon />
          {label}
          <ChevronRight />
        </Button>
      ))}
    </div>
  );
}
/** Provides shortcut actions from the dashboard overview. */
