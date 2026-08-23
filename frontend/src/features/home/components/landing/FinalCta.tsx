interface FinalCtaProps {
  onLaunch: () => void;
}

/** Renders or coordinates final cta for this frontend module. */
export default function FinalCta({ onLaunch }: FinalCtaProps) {
  return (
    <section className="relative overflow-hidden px-5 py-12 text-center md:px-8 md:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18),transparent_35%),linear-gradient(180deg,transparent,rgba(239,68,68,0.12))]" />
      <div className="relative mx-auto max-w-4xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-200">
          Final Signal
        </p>
        <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
          Ready to Monitor the Earth Smarter?
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button onClick={onLaunch} className="bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-red-700/30">
            Open Earthquake Monitoring
          </button>
          <button onClick={onLaunch} className="border border-cyan-200/30 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-cyan-50 backdrop-blur-xl">
            Explore Dashboard
          </button>
          <a href="#top-navbar" className="border border-white/10 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white">
            Back to Top
          </a>
        </div>
      </div>
    </section>
  );
}
/** Renders the final landing-page call to action before the footer. */
