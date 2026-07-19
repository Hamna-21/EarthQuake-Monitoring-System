import { ReactNode } from 'react';

interface SectionShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  id?: string;
}

export default function SectionShell({
  eyebrow,
  title,
  subtitle,
  children,
  id,
}: SectionShellProps) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-7xl px-5 py-20 md:px-8">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-200">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-4xl font-black tracking-normal text-white md:text-6xl">
          {title}
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-300">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
