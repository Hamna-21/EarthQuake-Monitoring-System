import React, { useState } from 'react';
import { Activity, BarChart3, ChevronLeft, Clock, Globe2, History, Home, List, LogOut, Map, Menu, ShieldAlert, User, X } from 'lucide-react';
import { DashboardPage } from '@/features/dashboard/types';
import RefreshNote from '@/features/dashboard/components/RefreshNote';
import DashboardSearch, { SearchSuggestion } from '@/features/dashboard/components/DashboardSearch';
import { ds } from '@/features/dashboard/utils/designSystem';

const nav = [
  ['overview', Home, 'Overview', 'Operations'],
  ['feed', List, 'Live Feed', 'Operations'],
  ['map', Map, 'Global Map', 'Monitoring'],
  ['historical_maps', History, 'Historical Maps', 'Monitoring'],
  ['analytics_global', BarChart3, 'Historical Analytics', 'Analysis'],
] as const;

type Props = {
  page: DashboardPage;
  setPage: (page: DashboardPage) => void;
  userEmail: string | null;
  userName: string | null;
  onLogout: () => void;
  onOpenWarningHub: () => void;
  searchValue: string;
  suggestions: SearchSuggestion[];
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
  onSearchOpen: (suggestion: SearchSuggestion) => void;
  onSearchSubmit: () => void;
  children: React.ReactNode;
};

export default function Shell(props: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = props.userName || props.userEmail?.split('@')[0] || 'Earthquake Monitoring System User';

  return (
    <div className={ds.page}>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_90%_25%,rgba(239,68,68,0.15),transparent_30%)]" />
    <aside className={`fixed inset-y-4 left-4 z-30 hidden flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.07] backdrop-blur-2xl shadow-[0_24px_90px_rgba(0,0,0,0.42)] transition-all duration-500 lg:flex ${collapsed ? 'w-24' : 'w-80'}`}>
        <div className="flex h-24 items-center gap-4 border-b border-white/10 px-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-400 shadow-lg shadow-red-500/25"><Activity className="h-6 w-6 text-white" /></span>
          {!collapsed && <div className="min-w-0"><h1 className="max-w-[13rem] text-base font-black leading-tight tracking-tight text-white">Earthquake Monitoring System</h1><p className="mt-1 max-w-[13rem] text-xs font-semibold leading-tight text-slate-400">Earthquake monitoring and information</p></div>}
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
          {[...new Set(nav.map((item) => item[3]))].map((section) => (
            <div key={section}>
              {!collapsed && <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{section}</p>}
              {nav.filter((item) => item[3] === section).map(([key, Icon, label]) => (
               <button
             key={key}
             title={label}
             onClick={() => props.setPage(key)}
            className={`group relative mb-2 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition duration-300 ${
              props.page === key
              ? 'border-cyan-300/25 bg-gradient-to-r from-cyan-400/15 via-white/10 to-red-500/10 text-white shadow-[0_20px_45px_rgba(8,145,178,0.16)] backdrop-blur-xl'
               : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/10 hover:text-white'
                 }`}
                 >  <Icon className="h-5 w-5 transition duration-300 group-hover:scale-110 group-hover:text-cyan-200" /> {!collapsed && label}
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
      {mobileOpen && <button type="button" aria-label="Close dashboard navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden" />}
      <aside className={`fixed inset-y-3 left-3 z-50 flex w-[min(17rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-white/12 bg-slate-950/95 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}>
        <div className="flex min-h-20 items-center justify-between gap-3 border-b border-white/10 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-400 shadow-lg shadow-red-500/25"><Activity className="h-5 w-5 text-white" /></span>
            <div className="min-w-0"><h1 className="max-w-[11rem] text-sm font-black leading-tight tracking-tight text-white">Earthquake Monitoring System</h1><p className="mt-1 text-[10px] font-semibold leading-tight text-slate-400">Monitoring and safety information</p></div>
          </div>
          <button type="button" onClick={() => setMobileOpen(false)} className="shrink-0 rounded-full bg-white/10 p-2 text-white" aria-label="Close dashboard navigation"><X className="h-4 w-4" /></button>
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {[...new Set(nav.map((item) => item[3]))].map((section) => (
            <div key={section}>
              <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{section}</p>
              {nav.filter((item) => item[3] === section).map(([key, Icon, label]) => (
                <button key={key} type="button" onClick={() => { props.setPage(key); setMobileOpen(false); }} className={`mb-1.5 flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-bold transition ${props.page === key ? 'border-cyan-300/25 bg-cyan-400/15 text-white' : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/10 hover:text-white'}`}>
                  <Icon className="h-4 w-4 shrink-0" />{label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-white"><User className="h-4 w-4" /></span><div className="min-w-0"><p className="truncate text-sm font-black text-white">{displayName}</p><p className="truncate text-[11px] text-slate-400">{props.userEmail}</p></div></div>
          <button onClick={props.onLogout} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white transition hover:border-red-300/30 hover:bg-red-500/10"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
      </aside>
      <div className={`transition-all ${collapsed ? 'lg:pl-32' : 'lg:pl-[336px]'}`}>
        <header className="sticky top-3 z-20 mx-3 mt-3 flex min-h-16 items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.07] px-3 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:mx-4 sm:mt-4 sm:px-4 md:px-6">
          <button type="button" onClick={() => setMobileOpen(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-white lg:hidden" aria-label="Open dashboard navigation"><Menu className="h-5 w-5" /></button>
          <div className="flex min-w-0 flex-1 items-center gap-2 lg:hidden"><Activity className="h-5 w-5 shrink-0 text-red-400" /><span className="max-w-[11rem] text-[10px] font-black uppercase leading-tight tracking-[0.1em] text-white sm:max-w-[15rem] sm:text-xs">Earthquake Monitoring System</span></div>
          <DashboardSearch value={props.searchValue} suggestions={props.suggestions} onChange={props.onSearchChange} onClear={props.onSearchClear} onOpen={props.onSearchOpen} onSubmit={props.onSearchSubmit} />
          <div className="hidden items-center gap-3 sm:flex"><Globe2 className="h-5 w-5 text-red-400" /><span className="text-sm font-black text-white">Online</span><Clock className="h-4 w-4 text-slate-400" /><span className="text-sm font-semibold text-slate-300">{new Date().toLocaleTimeString()}</span></div>
          <button onClick={props.onOpenWarningHub} className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-red-700 via-orange-500 to-amber-400 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:brightness-110 sm:rounded-2xl sm:px-4 sm:text-sm"><ShieldAlert className="h-4 w-4" /> Safety</button>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-6 md:px-8">{props.children}</main>
      </div>
    </div>
  );
}

export { RefreshNote };


