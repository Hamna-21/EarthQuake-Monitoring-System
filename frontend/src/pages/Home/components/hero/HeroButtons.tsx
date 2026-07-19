interface HeroButtonsProps {
  onExecuteSearch: () => void;
}

export default function HeroButtons({ onExecuteSearch }: HeroButtonsProps) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <button
        onClick={onExecuteSearch}
        className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-7 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white shadow-2xl shadow-red-700/35 transition duration-300 hover:scale-105 hover:shadow-red-500/55"
      >
        Explore Live Data
      </button>
      <button
        onClick={() =>
          document.getElementById('dashboard-deck')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="border border-cyan-200/30 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-50 backdrop-blur-xl transition duration-300 hover:border-cyan-200 hover:bg-cyan-300/10"
      >
        View Dashboard
      </button>
    </div>
  );
}
