import type { DashboardPage } from '../../../components/dashboard/types';

export default function AnalyticsRouteNav({ active, openPage }: { active: DashboardPage; openPage: (page: DashboardPage) => void }) {
  const links: Array<[DashboardPage, string]> = [
    ['analytics', 'Live Analytics'],
    ['analytics_pakistan', 'Pakistan Historical Analytics'],
  ];
  return (
    <nav className="mb-6 inline-flex rounded-2xl border border-white/10 bg-white/[0.06] p-1 shadow-2xl backdrop-blur-xl">
      {links.map(([page, label]) => (
        <button
          key={page}
          onClick={() => openPage(page)}
          className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${active === page ? 'bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 text-white shadow-lg shadow-orange-950/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
