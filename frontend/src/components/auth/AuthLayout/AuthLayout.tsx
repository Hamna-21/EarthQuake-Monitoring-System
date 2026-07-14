import React from 'react';
import { Activity, Globe, Cpu, ShieldAlert, LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  onBackToHome: () => void;
}

export default function AuthLayout({ children, onBackToHome }: AuthLayoutProps) {
  const stats: StatItem[] = [
    { label: 'Active Seismographs', value: '1,428', icon: Activity, color: 'text-red-500' },
    { label: 'Monitored Plates', value: '17 Major', icon: Globe, color: 'text-orange-500' },
    { label: 'Early Warnings Sent', value: '342 today', icon: ShieldAlert, color: 'text-yellow-500' },
    { label: 'Seismic Core Status', value: 'Nominal', icon: Cpu, color: 'text-emerald-500' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#120B0A] flex flex-col lg:flex-row relative overflow-hidden select-none text-white">
      {/* Dynamic Background Volcanic Lighting and Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[800px] h-[800px] rounded-none bg-red-900/10 blur-[150px] animate-pulse" />
        <div className="absolute -bottom-40 right-1/4 w-[700px] h-[700px] rounded-none bg-orange-950/20 blur-[180px]" />
        
        {/* Subtle glowing lines to simulate tectonic grids */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="red" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Button to escape back to Home Page in top left */}
      <button 
        onClick={onBackToHome}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-none border border-red-900/40 bg-black/40 text-xs font-bold uppercase tracking-widest text-red-300 hover:text-white hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
      >
        <Globe className="h-4 w-4 text-red-500 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Return to Dashboard</span>
      </button>

      {/* ================= LEFT SIDE: SEISMIC VISUALS ================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-black/30 border-r border-red-950/30 flex-col justify-between p-16 relative z-10">
        {/* Decorative Top Bracket */}
        <div className="flex items-center justify-between border-b border-red-900/20 pb-6">
          <div className="flex items-center gap-3">
            <Activity className="h-9 w-9 text-red-500 animate-pulse stroke-[2.8]" />
            <div>
              <span className="font-black text-2xl tracking-[0.2em] uppercase bg-gradient-to-r from-white via-red-200 to-orange-400 bg-clip-text text-transparent">
                GeoPulse
              </span>
            </div>
          </div>
        </div>

        {/* Animated Rotating Earth Representation / Seismic Radar */}
        <div className="my-auto flex flex-col items-center justify-center relative">
          {/* Glowing back-ring */}
          <div className="absolute w-[360px] h-[360px] rounded-full border border-red-950/20 bg-gradient-to-tr from-red-950/5 to-transparent blur-sm animate-pulse" />
          
          {/* Seismic Wave Pulse Effect */}
          <div className="absolute w-[440px] h-[440px] rounded-full border border-dashed border-red-500/10 animate-spin" style={{ animationDuration: '40s' }} />
          <div className="absolute w-[280px] h-[280px] rounded-full border border-red-500/15 animate-ping" style={{ animationDuration: '3.5s' }} />

          <div className="relative z-10 w-[280px] h-[280px] rounded-full overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.5)]">
            <img
              src="/images/images.jpg"
              alt="Rotating Earth"
              className="w-full h-full object-cover animate-spin"
              style={{
                animationDuration: "45s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
              }}
            />
          </div>
        </div>

        {/* Real-time stats section */}
        <div className="grid grid-cols-2 gap-4 border-t border-red-900/20 pt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-red-950/25 p-4 rounded-3xl backdrop-blur-md flex items-center gap-3">
              <div className={`p-2 bg-black/40 rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-lg font-bold tracking-tight">{stat.value}</span>
                <span className="block text-[10px] font-light uppercase tracking-wider text-red-100/50 mt-0.5">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT SIDE: CHILDREN FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-16 relative z-10">
        {/* Mobile Header Branding */}
        <div className="lg:hidden flex flex-col items-center mb-10 text-center mt-6">
          <Activity className="h-10 w-10 text-red-500 animate-pulse stroke-[2.8] mb-2" />
          <h1 className="font-black text-3xl tracking-[0.2em] uppercase bg-gradient-to-r from-white via-red-300 to-orange-400 bg-clip-text text-transparent">
            GeoPulse
          </h1>
          <p className="text-xs tracking-wider uppercase text-red-400 font-light mt-1">
            Global Seismic Monitoring Network
          </p>
        </div>

        <div className="w-full max-w-md bg-white/[0.03] border border-red-900/20 p-8 md:p-10 backdrop-blur-2xl shadow-2xl shadow-red-950/30 relative overflow-hidden rounded-none">
          {/* Subtle volcanic corner glows */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-[25px] rounded-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-600/5 blur-[25px] rounded-none" />
          {children}
        </div>
      </div>
    </div>
  );
}
