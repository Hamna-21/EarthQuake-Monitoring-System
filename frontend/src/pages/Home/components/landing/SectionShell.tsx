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
    <section id={id} className="relative mx-auto w-full max-w-7xl px-5 py-14 md:px-8 md:py-16">
      <div className="mb-7 max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-normal text-white md:text-5xl">
          {title}
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-300">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
