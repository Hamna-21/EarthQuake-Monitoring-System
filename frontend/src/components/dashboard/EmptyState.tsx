import React from 'react';
import { SearchX } from 'lucide-react';
import { ds } from './designSystem';

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
      <p className="mt-4 text-lg font-black text-slate-950">{title}</p>
      <p className={ds.caption}>{text}</p>
    </div>
  );
}
