import React from 'react';
import { SearchX } from 'lucide-react';
import { ds } from '@/features/dashboard/utils/designSystem';

/** Renders or coordinates empty state for this frontend module. */
export default function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className={`${ds.surface} border-dashed p-8 text-center`}>
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-700">
        <SearchX className="h-6 w-6" />
      </span>
      <p className="mt-4 text-lg font-black text-white">{title}</p>
      <p className={ds.caption}>{text}</p>
    </div>
  );
}



/** Renders the dashboard-wide empty-state presentation for missing data. */
