import { useState } from 'react';
import { Activity, House, Menu, ShieldAlert, X } from 'lucide-react';
import DesktopNav from './Navbar/components/DesktopNav';
import MobileNav from './Navbar/components/MobileNav';
import NavbarActions from './Navbar/components/NavbarActions';
import NavbarLogo from './Navbar/components/NavbarLogo';
import { NavLink } from './Navbar/types';

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
  onLogout,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks: NavLink[] = [
    { name: 'Home', href: 'home', icon: House },
    { name: 'Dashboard', href: 'Login.tsx', icon: Activity },
   
    ...(userEmail
      ? [
          { name: `Node: ${userEmail.split('@')[0]}`, href: 'profile', disabled: true },
          { name: 'Logout', href: 'logout' },
        ]
      : []),
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href === 'home') return onNavigate?.('home');
    if (href === 'Register.tsx') return onNavigate?.('register');
    if (href === 'Login.tsx') return onNavigate?.('login');
    if (href === 'logout') return onLogout?.();
    if (!href.startsWith('#')) return;
    if (currentView !== 'home') onNavigate?.('home');
    window.setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  return (
    <>
      <nav
        id="top-navbar"
        className="relative top-6 z-40 flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-5 shadow-lg shadow-red-900/10 backdrop-blur-2xl md:px-12"
      >
        <DesktopNav navLinks={navLinks} handleLinkClick={handleLinkClick} />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white/80 transition hover:text-white md:hidden"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <NavbarLogo onClick={() => handleLinkClick('home')} />
        <NavbarActions
          userEmail={userEmail}
          onLogin={() => handleLinkClick('Login.tsx')}
          onRegister={() => handleLinkClick('Register.tsx')}
          onOpenWarningHub={onOpenWarningHub}
        />
      </nav>
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
