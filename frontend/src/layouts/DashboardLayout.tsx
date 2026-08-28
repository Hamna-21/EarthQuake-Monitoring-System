import React, { useState } from 'react';
import { Menu as AntMenu, type MenuProps } from 'antd';
import { Activity, BarChart3, ChevronLeft, Clock, Globe2, History, Home, List, LogOut, Map, Menu as MenuIcon, ShieldAlert, User, X } from 'lucide-react';
import { DashboardPage } from '@/features/dashboard/types';
import RefreshNote from '@/features/dashboard/components/RefreshNote';
import DashboardSearch, { SearchSuggestion } from '@/features/dashboard/components/DashboardSearch';
import { ds } from '@/features/dashboard/utils/designSystem';
import IconButton from '@/components/ui/IconButton';

const nav = [
  ['overview', Home, 'Overview', 'Operations'],
  ['feed', List, 'Live Feed', 'Operations'],
  ['map', Map, 'Global Map', 'Monitoring'],
  ['historical_maps', History, 'Historical Maps', 'Monitoring'],
  ['analytics_global', BarChart3, 'Historical Analytics', 'Analysis'],
] as const;
const sections = [...new Set(nav.map((item) => item[3]))];
const menuItems: MenuProps['items'] = sections.map((section) => ({
  type: 'group',
  label: section,
  children: nav.filter((item) => item[3] === section).map(([key, Icon, label]) => ({ key, label, icon: <Icon className="dashboard-antd-menu__icon" /> })),
}));

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

/** Renders or coordinates shell for this frontend module. */
export default function Shell(props: Props) {
  // Render the shared glass dashboard shell, including responsive desktop and mobile navigation.
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName = props.userName || props.userEmail?.split('@')[0] || 'Earthquake Monitoring System User';

  return (
    <div className={`${ds.page} dashboard-shell`}>
    <div className="dashboard-shell__ambient" />
    <aside className={`dashboard-sidebar ${collapsed ? 'dashboard-sidebar--collapsed' : 'dashboard-sidebar--expanded'}`}>
        <div className="dashboard-sidebar__brand">
          <span className="dashboard-brand-mark"><Activity className="h-6 w-6 text-white" /></span>
          {!collapsed && <div className="min-w-0"><h1 className="max-w-[13rem] text-base font-black leading-tight tracking-tight text-white">Earthquake Monitoring System</h1></div>}
        </div>
        <nav className="dashboard-sidebar__nav"><AntMenu className="dashboard-antd-menu" mode="inline" inlineCollapsed={collapsed} selectedKeys={[props.page]} items={menuItems} onClick={({ key }) => props.setPage(key as DashboardPage)} /></nav>
        <div className="dashboard-sidebar__footer">
          <div className="dashboard-user-card">
            <div className="dashboard-user-row">
              <span className="dashboard-user-mark"><User className="h-5 w-5" /></span>
              {!collapsed && <div className="min-w-0"><p className="truncate text-sm font-black text-white">{displayName}</p><p className="truncate text-xs text-slate-400">{props.userEmail}</p></div>}
            </div>
            {!collapsed && <button onClick={props.onLogout} className="dashboard-logout"><LogOut className="h-4 w-4" /> Logout</button>}
          </div>
        </div>
        <IconButton onClick={() => setCollapsed(!collapsed)} className="absolute right-3 top-3"><ChevronLeft className={`h-4 w-4 transition ${collapsed ? 'rotate-180' : ''}`} /></IconButton>
      </aside>
      {mobileOpen && <button type="button" aria-label="Close dashboard navigation" onClick={() => setMobileOpen(false)} className="dashboard-mobile-overlay" />}
      <aside className={`dashboard-mobile-sidebar ${mobileOpen ? '' : 'dashboard-mobile-sidebar--closed'}`}>
        <div className="dashboard-mobile-header">
          <div className="dashboard-mobile-brand">
            <span className="dashboard-brand-mark"><Activity className="h-5 w-5 text-white" /></span>
            <div className="min-w-0"><h1 className="max-w-[11rem] text-sm font-black leading-tight tracking-tight text-white">Earthquake Monitoring System</h1><p className="mt-1 text-[10px] font-semibold leading-tight text-slate-400">Monitoring and safety information</p></div>
          </div>
          <IconButton type="button" onClick={() => setMobileOpen(false)} className="shrink-0" aria-label="Close dashboard navigation"><X className="h-4 w-4" /></IconButton>
        </div>
        <nav className="dashboard-mobile-nav"><AntMenu className="dashboard-antd-menu dashboard-antd-menu--mobile" mode="inline" selectedKeys={[props.page]} items={menuItems} onClick={({ key }) => { props.setPage(key as DashboardPage); setMobileOpen(false); }} /></nav>
        <div className="dashboard-mobile-footer">
          <div className="dashboard-mobile-user"><span className="dashboard-user-mark"><User className="h-4 w-4" /></span><div className="min-w-0"><p className="truncate text-sm font-black text-white">{displayName}</p><p className="truncate text-[11px] text-slate-400">{props.userEmail}</p></div></div>
          <button onClick={props.onLogout} className="dashboard-logout"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
      </aside>
      <div className={`dashboard-content ${collapsed ? 'dashboard-content--collapsed' : 'dashboard-content--expanded'}`}>
        <header className="dashboard-topbar">
          <button type="button" onClick={() => setMobileOpen(true)} className="dashboard-topbar__mobile-menu" aria-label="Open dashboard navigation"><MenuIcon className="h-5 w-5" /></button>
          <div className="dashboard-topbar__mobile-brand"><Activity className="h-5 w-5 shrink-0 text-red-400" /><span className="max-w-[11rem] text-[10px] font-black uppercase leading-tight tracking-[0.1em] text-white sm:max-w-[15rem] sm:text-xs">Earthquake Monitoring System</span></div>
          <DashboardSearch value={props.searchValue} suggestions={props.suggestions} onChange={props.onSearchChange} onClear={props.onSearchClear} onOpen={props.onSearchOpen} onSubmit={props.onSearchSubmit} />
          <div className="dashboard-topbar__actions">
            <div className="dashboard-topbar__status"><Globe2 className="h-5 w-5 text-red-400" /><span className="text-sm font-black text-white">Online</span><Clock className="h-4 w-4 text-slate-400" /><span className="text-sm font-semibold text-slate-300">{new Date().toLocaleTimeString()}</span></div>
            <button type="button" onClick={props.onOpenWarningHub} aria-label="Open Warning Hub" className="dashboard-safety-button"><ShieldAlert className="h-4 w-4" /> Safety</button>
          </div>
        </header>
        <main className="dashboard-main">{props.children}</main>
      </div>
    </div>
  );
}

export { RefreshNote };


