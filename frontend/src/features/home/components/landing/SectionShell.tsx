import type { ReactNode } from 'react';

interface SectionShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  id?: string;
  backgroundImage?: string;
}

/** Renders or coordinates section shell for this frontend module. */
export default function SectionShell({
  eyebrow,
  title,
  subtitle,
  children,
  id,
  backgroundImage,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className="relative mx-auto w-full max-w-7xl overflow-hidden px-5 py-8 md:px-8 md:py-10"
    >
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-slate-950/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-slate-950/35" />
        </>
      )}

      <div className="relative z-10">
        <div className="mb-4 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-200">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-xl font-black tracking-normal text-white md:text-3xl">
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-300 md:text-sm">
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}
/** Provides consistent spacing and alignment for landing-page sections. */
