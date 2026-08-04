export default function AssistantWelcome({ userName }: { userName: string }) {
  return (
    <main className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-8">
      <div className="max-w-3xl rounded-2xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl">
        <h2 className="bg-gradient-to-r from-cyan-200 via-white to-rose-200 bg-clip-text text-5xl font-black tracking-tight text-transparent">
          Hi, {userName}
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-200">
          I can help with earthquake safety, seismic terms, live dashboard data, nearby risk, historical events, alerts, and GeoPulse navigation.
        </p>
      </div>
    </main>
  );
}
