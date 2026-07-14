import React from 'react';
import { Activity, AlertCircle, BarChart3, Bell, Clock, Globe2, History, Home, List, LocateFixed, LogOut, Map, ShieldAlert } from 'lucide-react';
import { DashboardPage } from './types';

const nav = [
  ['overview', Home, 'Overview'],
  ['feed', List, 'Live Feed'],
  ['map', Map, 'Global Map'],
  ['history', History, 'Historical'],
  ['analytics', BarChart3, 'Analytics'],
  ['details', AlertCircle, 'Details'],
  ['nearby', LocateFixed, 'Nearby'],
  ['alerts', Bell, 'Alerts']
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

export default function Shell({ page, setPage, userEmail, userName, onLogout, onOpenWarningHub, children }: Props) {
  const displayName = userName || userEmail?.split('@')[0] || 'GeoPulse User';
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
     <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col overflow-y-auto border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-24 items-center gap-4 border-b border-slate-200 px-8">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-red-700 text-white"><Activity className="h-6 w-6" /></span>
          <div><h1 className="text-xl font-black tracking-tight text-slate-950">GeoPulse</h1><p className="text-xs font-semibold text-slate-500">Earthquake Monitoring</p></div>
        </div>
        <nav className="flex-1  space-y-3 px-5 py-6">
          {nav.map(([key, Icon, label]) => (
            <button key={key} onClick={() => setPage(key)} className={`flex w-full items-center gap-3 rounded-xl px-5 py-4 text-sm font-semibold transition ${page === key ? 'bg-red-50 text-red-800' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-200 px-6 py-6">
          <p className="truncate text-sm font-bold text-slate-900">{displayName}</p>
          <p className="truncate text-xs text-slate-500">{userEmail}</p>
          <button onClick={onLogout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5 text-red-700" />
            <div><p className="text-sm font-black text-slate-950">Earthquake Monitoring</p><p className="text-xs text-slate-500">Real records only, refreshed every 60 seconds</p></div>
          </div>
          <button onClick={onOpenWarningHub} className="flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"><ShieldAlert className="h-4 w-4" /> Safety</button>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}

import PageTitle from './PageTitle';
import RefreshNote from './RefreshNote';

export { PageTitle, RefreshNote };

