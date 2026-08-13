export default function OverviewEmptyState() {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-10 text-center shadow-sm backdrop-blur">
      <p className="font-serif text-2xl font-black text-white">No matching earthquakes found</p>
      <p className="mt-2 text-sm font-semibold text-slate-400">
        Try a country, location, magnitude, alert level, status, or event ID.
      </p>
    </div>
  );
}
