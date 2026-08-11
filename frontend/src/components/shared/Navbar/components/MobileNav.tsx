import React from 'react';

interface NavLink {
  name: string;
  href: string;
  disabled?: boolean;
}

interface MobileNavProps {
  isMobileMenuOpen: boolean;
  navLinks: NavLink[];
  handleLinkClick: (href: string) => void;
  onOpenWarningHub: () => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function MobileNav({
  isMobileMenuOpen,
  navLinks,
  handleLinkClick,
  onOpenWarningHub,
  setIsMobileMenuOpen,
}: MobileNavProps) {
  if (!isMobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-30 md:hidden bg-black/95 backdrop-blur-lg flex flex-col justify-center px-10 py-20 animate-fade-in">
      <div className="flex flex-col space-y-6 text-xl font-light text-white/80">
        {navLinks.map((link) => (
          <button
            key={link.href}
            onClick={() => handleLinkClick(link.href)}
            className="text-left py-3 border-b border-white/10 hover:text-red-400 transition-all uppercase tracking-widest text-sm"
          >
            {link.name}
          </button>
        ))}

        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            onOpenWarningHub();
          }}
          className="mt-6 w-full py-3 rounded-none bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold uppercase tracking-wider shadow-xl shadow-red-500/30 hover:scale-105 transition-all duration-300"
        >
          Early Warning Hub
        </button>
      </div>
    </div>
  );
}
