import React, { useState } from 'react';
import { Activity, AlertCircle, BarChart3, Bell, ChevronLeft, Clock, Globe2, History, Home, List, LocateFixed, LogOut, Map, Search, ShieldAlert, User } from 'lucide-react';
import { DashboardPage } from './types';
import PageTitle from './PageTitle';
import RefreshNote from './RefreshNote';

const nav = [
  ['overview', Home, 'Overview', 'Operations'],
  ['feed', List, 'Live Feed', 'Operations'],
  ['map', Map, 'Global Map', 'Monitoring'],
  ['history', History, 'Historical', 'Analysis'],
  ['analytics', BarChart3, 'Analytics', 'Analysis'],
  ['details', AlertCircle, 'Details', 'Analysis'],
  ['nearby', LocateFixed, 'Nearby', 'Safety'],
  ['alerts', Bell, 'Alerts', 'Safety'],
] as const;

type Props = {
  page: DashboardPage;
  setPage: (page: DashboardPage) => void;
  userEmail: string | null;
  userName: string | null;
  onLogout: () => void;
  onOpenWarningHub: () => void;
  children: React.ReactNode;
};

export default function Shell(props: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const displayName = props.userName || props.userEmail?.split('@')[0] || 'GeoPulse User';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fee2e2,transparent_32%),linear-gradient(135deg,#f8fafc,#eef2ff)] text-slate-900">
    <aside
  className={`fixed inset-y-4 left-4
z-30
hidden
flex-col
overflow-hidden
rounded-none
border
border-white/30
bg-white/25
backdrop-blur-[30px]
shadow-[0_20px_70px_rgba(0,0,0,0.15)]
transition-all
duration-500
lg:flex
${collapsed ? "w-24" : "w-80"}
`}
>
        <div className="flex h-24 items-center gap-4 border-b border-white/10 px-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 shadow-lg"><Activity className="h-6 w-6" /></span>
          {!collapsed && <div><h1 className="text-xl font-black tracking-tight">GeoPulse</h1><p className="text-xs font-semibold text-slate-400"></p></div>}
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
          {[...new Set(nav.map((item) => item[3]))].map((section) => (
            <div key={section}>
              {!collapsed && <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{section}</p>}
              {nav.filter((item) => item[3] === section).map(([key, Icon, label]) => (
                <button key={key} title={label} onClick={() => props.setPage(key)} className={`group relative mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${props.page === key
  ? 'bg-white/50 border border-white/40 text-slate-900 shadow-xl backdrop-blur-xl'
  : 'text-slate-700 hover:bg-white/30 hover:text-slate-900'}`}>
                  <span className={`absolute left-0 h-8 w-1 rounded-full transition ${props.page === key ? 'bg-red-500 opacity-100' : 'opacity-0'}`} />
                  <Icon className="h-5 w-5 transition group-hover:scale-110" /> {!collapsed && label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/8 p-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><User className="h-5 w-5" /></span>
              {!collapsed && <div className="min-w-0"><p className="truncate text-sm font-black">{displayName}</p><p className="truncate text-xs text-slate-400">{props.userEmail}</p></div>}
            </div>
            {!collapsed && <button onClick={props.onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-200 hover:bg-white/10"><LogOut className="h-4 w-4" /> Logout</button>}
          </div>
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-slate-200"><ChevronLeft className={`h-4 w-4 transition ${collapsed ? 'rotate-180' : ''}`} /></button>
      </aside>
      <div className={`transition-all ${collapsed ? 'lg:pl-32' : 'lg:pl-[336px]'}`}>
        <header className="sticky top-4 z-20 mx-4 mt-4 flex min-h-16 items-center justify-between rounded-3xl border border-white/70 bg-white/85 px-4 shadow-lg backdrop-blur md:px-6">
          <div className="hidden items-center gap-3 rounded-2xl bg-slate-100 px-4 py-2 md:flex"><Search className="h-4 w-4 text-slate-400" /><span className="text-sm font-semibold text-slate-500">Search earthquakes, countries, actions</span></div>
          <div className="flex items-center gap-3"><Globe2 className="h-5 w-5 text-red-700" /><span className="text-sm font-black">Online</span><Clock className="h-4 w-4 text-slate-400" /><span className="text-sm font-semibold text-slate-500">{new Date().toLocaleTimeString()}</span></div>
          <button onClick={props.onOpenWarningHub} className="flex items-center gap-2 rounded-2xl bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"><ShieldAlert className="h-4 w-4" /> Safety</button>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">{props.children}</main>
      </div>
    </div>
  );
}

export { PageTitle, RefreshNote };
