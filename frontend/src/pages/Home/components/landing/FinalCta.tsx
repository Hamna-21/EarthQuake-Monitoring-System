interface FinalCtaProps {
  onLaunch: () => void;
}

export default function FinalCta({ onLaunch }: FinalCtaProps) {
  return (
    <section className="relative overflow-hidden px-5 py-24 text-center md:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.18),transparent_35%),linear-gradient(180deg,transparent,rgba(239,68,68,0.12))]" />
      <div className="relative mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.34em] text-cyan-200">
          Final Signal
        </p>
        <h2 className="mt-5 text-5xl font-black text-white md:text-7xl">
          Ready to Monitor the Earth Smarter?
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button onClick={onLaunch} className="bg-red-600 px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-white shadow-xl shadow-red-700/30">
            Launch GeoPulse
          </button>
          <button onClick={onLaunch} className="border border-cyan-200/30 bg-white/5 px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-cyan-50 backdrop-blur-xl">
            Explore Dashboard
          </button>
          <a href="#top-navbar" className="border border-white/10 bg-white/5 px-7 py-4 text-sm font-black uppercase tracking-[0.22em] text-white">
            Back to Top
          </a>
        </div>
      </div>
    </section>
  );
}
