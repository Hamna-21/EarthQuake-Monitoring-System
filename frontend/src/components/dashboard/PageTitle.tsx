import React from 'react';

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
    <section className="relative mb-10 overflow-hidden bg-gradient-to-r from-red-950 via-red-900 to-red-700 px-10 py-12 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.08),transparent_40%)]" />

      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red-400/10 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-black/20 blur-3xl" />

      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-red-200">
          {eyebrow}
        </p>

        <h1 className="mt-4 text-5xl font-black">
          {title}
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-red-100">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
