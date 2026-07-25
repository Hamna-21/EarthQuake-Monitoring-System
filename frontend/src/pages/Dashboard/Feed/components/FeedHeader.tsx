export default function FeedHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-red-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <p className="relative flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-red-300"><span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" /></span>Live Feed</p>
      <h1 className="relative mt-3 font-serif text-3xl font-black italic tracking-tight text-white sm:text-4xl">Every tremor, as it happens.</h1>
      <p className="relative mt-2 max-w-xl text-sm font-light leading-relaxed text-slate-300">Scan, filter, and export global seismic activity the moment it's detected.</p>
    </div>
  );
}


