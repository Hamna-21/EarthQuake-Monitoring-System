import React from 'react';
import { Activity, Heart } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import WarningHub from '../../components/warnings/WarningHub';
import Footer from '../../components/common/Footer/Footer';
import { Earthquake } from '../../types';
import HomeHero from './components/HomeHero';
import HomeFeatures from './components/HomeFeatures';

interface HomeProps {
  earthquakes: Earthquake[];
  currentView: 'home' | 'login' | 'register';
  userEmail: string | null;
  userName: string | null;
  onNavigate: (view: 'home' | 'login' | 'register') => void;
  onLogout: () => void;
  isWarningHubOpen: boolean;
  setIsWarningHubOpen: (open: boolean) => void;
  handleExecuteSearch: () => void;
}

export default function Home({
  earthquakes,
  currentView,
  userEmail,
  onNavigate,
  onLogout,
  isWarningHubOpen,
  setIsWarningHubOpen,
  handleExecuteSearch,
}: HomeProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#120B0A] via-[#241311] to-[#3A1E19] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-none bg-red-700/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[140px]" />
      </div>

      {/* Earthquake Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat opacity-20 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage:
            "url('https://www.electronic-sirens.com/wp-content/uploads/2026/06/earthquake-early-warning-system-six-major-earthquakes-1170x663.jpg')",
          backgroundPosition: "center top",
        }}
      />

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(18,11,10,0.92)_90%)] pointer-events-none" />

      {/* ====================================================== */}
      {/* NAVIGATION */}
      {/* ====================================================== */}
      <Navbar 
        onOpenWarningHub={() => setIsWarningHubOpen(true)} 
        onNavigate={onNavigate}
        currentView={currentView}
        userEmail={userEmail}
        onLogout={onLogout}
      />

      {/* ====================================================== */}
      {/* HERO SECTION */}
      {/* ====================================================== */}
      <HomeHero
        earthquakesCount={earthquakes.length}
        onExecuteSearch={handleExecuteSearch}
      />

      {/* ====================================================== */}
      {/* MAIN DASHBOARD */}
      {/* ====================================================== */}
      <main
        id="dashboard-deck"
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 space-y-12"
      >
        {/* ================= Dashboard Divider ================= */}
        <div className="flex items-center gap-4 py-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-800/40 to-red-500/40" />
          <div className="flex items-center gap-3 rounded-none border border-red-900/30 bg-white/5 px-6 py-2 backdrop-blur-xl shadow-lg shadow-red-900/20">
            <Activity className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-100">
              Live Seismic Dashboard
            </span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-red-800/40 to-red-500/40" />
        </div>

        {/* ================= Bottom Info Cards ================= */}
        <HomeFeatures />
      </main>

      {/* ====================================================== */}
      {/* WARNING HUB MODAL */}
      {/* ====================================================== */}
      <WarningHub
        isOpen={isWarningHubOpen}
        onClose={() => setIsWarningHubOpen(false)}
      />

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}
      <Footer />
    </div>
  );
}

