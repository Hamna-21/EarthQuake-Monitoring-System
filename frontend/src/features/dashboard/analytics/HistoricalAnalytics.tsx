import type { DashboardProps } from '@/features/dashboard/types';
import { HistoricalAnalyticsPanel } from '@/features/dashboard/analytics/GlobalHistoricalAnalytics';
import { useDashboardPageState } from '@/features/dashboard/hooks/DashboardStateContext';

type Tab = 'global' | 'pakistan';
export default function HistoricalAnalyticsPage(props: DashboardProps) {
  const [tab, setTab] = useDashboardPageState<Tab>('historical-analytics-tab', 'global', true);
  return <div className="space-y-4"><nav className="inline-flex rounded-2xl border border-white/10 bg-white/[0.07] p-1 shadow-sm backdrop-blur">{(['global', 'pakistan'] as Tab[]).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-xl px-4 py-2 text-xs font-black transition ${tab === item ? 'bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>{item === 'global' ? 'Global Historical Analytics' : 'Pakistan Historical Analytics'}</button>)}</nav><HistoricalAnalyticsPanel key={tab} {...props} region={tab} /></div>;
}
