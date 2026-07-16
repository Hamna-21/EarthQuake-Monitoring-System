import React, { useState } from 'react';
import { Activity, Globe, Menu, X, ShieldAlert, House } from 'lucide-react';
import DesktopNav from './Navbar/components/DesktopNav';
import MobileNav from './Navbar/components/MobileNav';

interface NavLink {
  name: string;
  href: string;
  disabled?: boolean;
  
}

interface NavbarProps {
  onOpenWarningHub: () => void;
  onNavigate?: (view: 'home' | 'login' | 'register') => void;
  currentView?: 'home' | 'login' | 'register';
  userEmail?: string | null;
  onLogout?: () => void;
}

export default function Navbar({ 
  onOpenWarningHub, 
  onNavigate, 
  currentView = 'home', 
  userEmail, 
  onLogout 
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const baseLinks = [
    { name: 'Home', href: 'home',icon: House },
    { name: 'Dashboard', href: 'Login.tsx',icon: Activity },
    { name: 'Safety Hub', href: '#safety-hub',icon: ShieldAlert },
  ];

  const authLinks = userEmail
  ? [
      { name: `Node: ${userEmail.split('@')[0]}`, href: 'profile', disabled: true },
      { name: 'Logout', href: 'logout' }
    ]
  : [];

  const navLinks = [...baseLinks, ...authLinks];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href === 'home') {
      if (onNavigate) onNavigate('home');
      return;
    }
    
    if (href === 'Register.tsx') {
      if (onNavigate) onNavigate('register');
      return;
    }
    
    if (href === 'Login.tsx') {
      if (onNavigate) onNavigate('login');
      return;
    }
    
    if (href === 'logout') {
      if (onLogout) onLogout();
      return;
    }

    if (href.startsWith('#')) {
      if (currentView !== 'home') {
        if (onNavigate) onNavigate('home');
        setTimeout(() => {
          try {
            const element = document.querySelector(href);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          } catch (e) {
            console.error(e);
          }
        }, 150);
      } else {
        try {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } catch (err) {
          console.error("Navigation error:", err);
        }
      }
    }
  };

  return (
    <>
      <nav
        id="top-navbar"
        className="relative top-6 z-40 flex items-center justify-between px-6 md:px-12 py-5 bg-black/40 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-red-900/10"
      >
        {/* Left Navigation Links - Desktop */}
        <DesktopNav navLinks={navLinks} handleLinkClick={handleLinkClick} />

        {/* Mobile Hamburger Trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white/80 hover:text-white p-2 focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Floating Logo Above Navbar */}
        <div 
          onClick={() => handleLinkClick('home')}
          className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50 cursor-pointer"
        >
          <Activity className="h-8 w-8 text-red-500 animate-pulse stroke-[2.8] drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
          <span className="font-black text-2xl tracking-[0.25em] uppercase bg-gradient-to-r from-white via-red-300 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
            GeoPulse
          </span>
        </div>

        {/* Right CTA / Action Buttons */}
<div className="flex items-center gap-3">
 {!userEmail && (
    <>
      {/* Login */}
      <button
        onClick={() => handleLinkClick("Login.tsx")}
        className="relative overflow-hidden px-4 py-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-xl text-white font-medium tracking-wide hover:border-red-400/60 hover:bg-white/10 hover:text-red-300 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        Login
      </button>

      {/* Register */}
      <button
        onClick={() => handleLinkClick("Register.tsx")}
        className="relative overflow-hidden px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-semibold tracking-wide shadow-xl shadow-red-600/30 hover:shadow-red-500/60 hover:scale-105 transition-all duration-300"
      >
        Register
      </button>
    </>
  )}


  <button
    onClick={onOpenWarningHub}
    className="group px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white text-xs font-bold uppercase tracking-widest shadow-xl shadow-red-600/30 hover:shadow-red-500/60 hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-red-400/20"
  >
    <ShieldAlert className="h-4 w-4 group-hover:animate-pulse" />
    <span className="hidden sm:inline">Early Warning Hub</span>
    <span className="sm:hidden">Alerts</span>
  </button>

</div>
      </nav>

      {/* Mobile Menu Drawer Overlay */}
      <MobileNav
        isMobileMenuOpen={isMobileMenuOpen}
        navLinks={navLinks}
        handleLinkClick={handleLinkClick}
        onOpenWarningHub={onOpenWarningHub}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </>
  );
}
