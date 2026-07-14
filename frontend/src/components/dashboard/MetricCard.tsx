import React from 'react';

export default function MetricCard({
  label,
  value,
  help,
}: {
  label: string;
  value: string | number;
  help: string;
}) {
  return (
    <article className="rounded-none border border-red-100 bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-red-500">
        {label}
      </p>
      <strong className="mt-3 block text-3xl font-black text-black-950">
        {value}
      </strong>
      <p className="mt-2 text-sm text-black-500">{help}</p>
    </article>
  );
}
