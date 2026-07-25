import { Flame, Globe2, Search, Waves } from 'lucide-react';
import { MetricCard } from '../../../../components/dashboard/ui';

export default function HistoryMetrics({ records, strongest, countries, tsunami }: { records: number; strongest: string; countries: number; tsunami: number; }) {
  return (
    <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Records Found" value={records} help="Returned by this historical query" tone="cyan" icon={<Search className="h-4 w-4" />} />
      <MetricCard label="Strongest" value={strongest} help="Maximum magnitude" tone="red" icon={<Flame className="h-4 w-4" />} />
      <MetricCard label="Countries" value={countries} help="Extracted from locations" tone="emerald" icon={<Globe2 className="h-4 w-4" />} />
      <MetricCard label="Tsunami" value={tsunami} help="Official tsunami flag" tone="violet" icon={<Waves className="h-4 w-4" />} />
    </section>
  );
}
