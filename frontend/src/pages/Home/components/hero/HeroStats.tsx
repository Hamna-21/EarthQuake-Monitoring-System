interface HeroStatsProps {
  earthquakesCount: number;
}

const stats = [
  { label: 'Historical Archive', value: '1990-2026', tone: 'text-orange-200' },
  { label: 'Monitoring', value: '24/7', tone: 'text-cyan-200' },
  { label: 'Coverage', value: 'Global', tone: 'text-red-200' },
];

export default function HeroStats({ earthquakesCount }: HeroStatsProps) {
  const liveStats = [
    { label: 'Live Events', value: earthquakesCount, tone: 'text-red-300' },
    ...stats,
  ];

  return (
    <div className="mx-auto mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-3xl">
      {liveStats.map((stat) => (
        <div key={stat.label} className="border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <h3 className={`text-2xl font-bold md:text-3xl ${stat.tone}`}>{stat.value}</h3>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50/65">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
