import SafetyCard from './SafetyCard';

export default function SafetyHubVideo() {
  return (
    <SafetyCard className="overflow-hidden p-0">
      <div className="border-b border-white/10 p-5">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
          Learning Center
        </p>
        <h3 className="mt-2 text-2xl font-black text-white">Drop, cover, hold</h3>
      </div>
      <div className="aspect-video bg-black">
        <iframe
          className="h-full w-full"
          src="https://www.youtube.com/embed/avvBpyh1kdE?si=tGbetz6P-Cgzn7dx"
          title="Earthquake safety learning video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </SafetyCard>
  );
}
