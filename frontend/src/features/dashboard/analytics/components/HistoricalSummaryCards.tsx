import { Activity, CalendarDays, Gauge, Layers, MapPin, TrendingUp } from 'lucide-react';
import AnalyticsStatCard from '@/features/dashboard/analytics/components/AnalyticsStatCard';
import type { HistoricalAnalyticsResponse } from '@/features/dashboard/analytics/services/historicalAnalyticsService';

const f = (value: number | null | undefined, digits = 1) => Number.isFinite(value) ? Number(value).toFixed(digits) : '-';

export default function HistoricalSummaryCards({ data }: { data: HistoricalAnalyticsResponse }) {
  const s = data.summary;
  const cards = [
    [<Activity className="h-4 w-4" />, 'Total earthquakes', s.totalEvents.toLocaleString(), 'Records in the selected range'],
    [<Gauge className="h-4 w-4" />, 'Strongest magnitude', f(s.strongestMagnitude), 'Highest recorded magnitude'],
    [<TrendingUp className="h-4 w-4" />, 'Average magnitude', f(s.averageMagnitude, 2), 'Typical recorded strength'],
    [<Layers className="h-4 w-4" />, 'Average depth', `${f(s.averageDepth, 1)} km`, 'Typical depth below surface'],
    [<CalendarDays className="h-4 w-4" />, 'Most active year', s.mostActiveYear ? `${s.mostActiveYear.year}` : '-', `${s.mostActiveYear?.count ?? 0} earthquakes`],
    [<MapPin className="h-4 w-4" />, 'Most active month', s.mostActiveMonth ? `${s.mostActiveMonth.label} ${s.mostActiveMonth.year}` : '-', `${s.mostActiveMonth?.count ?? 0} earthquakes`],
  ];
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {cards.map(([icon, label, value, help]) => (
        <AnalyticsStatCard key={String(label)} icon={icon} label={String(label)} value={String(value)} help={String(help)} gradient="from-rose-500 via-orange-500 to-amber-400" glow="shadow-orange-900/40" />
      ))}
    </section>
  );
}
