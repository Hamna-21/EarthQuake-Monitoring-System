import { History } from 'lucide-react';
import PageTitle from '@/features/dashboard/components/common/PageTitle';

/** Renders or coordinates history page header for this frontend module. */
export default function HistoryPageHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return <PageTitle className="mb-4" eyebrow={label} title={title} subtitle={description} icon={History} />;
}
/** Renders the historical page heading and contextual actions. */
