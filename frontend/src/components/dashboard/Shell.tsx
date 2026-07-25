import React, { useState } from 'react';
import { Activity, AlertCircle, BarChart3, Bell, ChevronLeft, Clock, Globe2, History, Home, List, LocateFixed, LogOut, Map, Search, ShieldAlert, User } from 'lucide-react';
import { DashboardPage } from './types';
import PageTitle from './PageTitle';
import RefreshNote from './RefreshNote';
import { ds } from './designSystem';

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
    <div className={ds.page}>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_90%_25%,rgba(239,68,68,0.15),transparent_30%)]" />
    <aside className={`fixed inset-y-4 left-4 z-30 hidden flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.07] backdrop-blur-2xl shadow-[0_24px_90px_rgba(0,0,0,0.42)] transition-all duration-500 lg:flex ${collapsed ? 'w-24' : 'w-80'}`}>
        <div className="flex h-24 items-center gap-4 border-b border-white/10 px-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-400 shadow-lg shadow-red-500/25"><Activity className="h-6 w-6 text-white" /></span>
          {!collapsed && <div><h1 className="text-xl font-black tracking-tight text-white">GeoPulse</h1><p className="text-xs font-semibold text-slate-400">Global seismic intelligence</p></div>}
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
          {[...new Set(nav.map((item) => item[3]))].map((section) => (
            <div key={section}>
              {!collapsed && <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{section}</p>}
              {nav.filter((item) => item[3] === section).map(([key, Icon, label]) => (
                <button key={key} title={label} onClick={() => props.setPage(key)} className={`group relative mb-2 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition duration-300 ${props.page === key
  ? 'border-cyan-300/25 bg-gradient-to-r from-cyan-400/15 via-white/10 to-red-500/10 text-white shadow-[0_20px_45px_rgba(8,145,178,0.16)] backdrop-blur-xl'
  : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/10 hover:text-white'}`}>
                  <span className={`absolute left-0 h-8 w-1 rounded-full transition ${props.page === key ? 'bg-gradient-to-b from-cyan-300 to-red-500 opacity-100' : 'opacity-0'}`} />
                  <Icon className="h-5 w-5 transition duration-300 group-hover:scale-110 group-hover:text-cyan-200" /> {!collapsed && label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-3 shadow-inner shadow-white/5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white"><User className="h-5 w-5" /></span>
              {!collapsed && <div className="min-w-0"><p className="truncate text-sm font-black text-white">{displayName}</p><p className="truncate text-xs text-slate-400">{props.userEmail}</p></div>}
            </div>
            {!collapsed && <button onClick={props.onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm font-bold text-white transition hover:border-red-300/30 hover:bg-red-500/10"><LogOut className="h-4 w-4" /> Logout</button>}
          </div>
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-white"><ChevronLeft className={`h-4 w-4 transition ${collapsed ? 'rotate-180' : ''}`} /></button>
      </aside>
      <div className={`transition-all ${collapsed ? 'lg:pl-32' : 'lg:pl-[336px]'}`}>
        <header className="sticky top-4 z-20 mx-4 mt-4 flex min-h-16 items-center justify-between rounded-2xl border border-white/12 bg-white/[0.07] px-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:px-6">
          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-2 transition hover:border-cyan-300/25 md:flex"><Search className="h-4 w-4 text-cyan-200" /><span className="text-sm font-semibold text-slate-300">Search earthquakes, countries, actions</span></div>
          <div className="flex items-center gap-3"><Globe2 className="h-5 w-5 text-red-400" /><span className="text-sm font-black text-white">Online</span><Clock className="h-4 w-4 text-slate-400" /><span className="text-sm font-semibold text-slate-300">{new Date().toLocaleTimeString()}</span></div>
          <button onClick={props.onOpenWarningHub} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 via-orange-500 to-amber-400 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:brightness-110"><ShieldAlert className="h-4 w-4" /> Safety</button>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">{props.children}</main>
      </div>
    </div>
  );
}

export { PageTitle, RefreshNote };


