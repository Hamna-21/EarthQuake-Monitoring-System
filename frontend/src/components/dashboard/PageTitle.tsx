import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ds } from './designSystem';

export default function PageTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-8 py-10 text-white shadow-2xl backdrop-blur-xl">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-red-400/15 blur-3xl" />
      <div className="relative z-10">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
          Dashboard <ChevronRight className="h-3 w-3" /> {eyebrow}
        </p>
        <h1 className={`mt-4 ${ds.title} text-white`}>{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">{subtitle}</p>
      </div>
    </section>
  );
}


