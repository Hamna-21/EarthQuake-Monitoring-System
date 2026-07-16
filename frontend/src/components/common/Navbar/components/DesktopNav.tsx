import { LucideIcon } from 'lucide-react';
import React from 'react';

interface NavLink {
  name: string;
  href: string;
  disabled?: boolean;
    icon?: LucideIcon;
}

interface DesktopNavProps {
  navLinks: NavLink[];
  handleLinkClick: (href: string) => void;
}

export default function DesktopNav({ navLinks, handleLinkClick }: DesktopNavProps) {
  return (
    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/80 tracking-wide">
      
  {navLinks.map((link) => {
  const Icon = link.icon;

  return (
    <button
      key={link.href}
      onClick={() => handleLinkClick(link.href)}
      disabled={link.disabled}
     className="group relative flex items-center justify-center px-9.5  py-2.5 rounded-lg bg-white/5 backdrop-blur-xl
        border
        border-white/10
        text-white/80
        font-medium
        tracking-wide
        hover:bg-red-500/10
        hover:border-red-500/40
        hover:text-white
        hover:-translate-y-1
        hover:shadow-lg
        hover:shadow-red-500/20
        transition-all
        duration-300
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      
    
      {Icon && (
        <Icon className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform duration-300" />
      )}

      <span>{link.name}</span>
    </button>
  );
})}
    </div>
  );
}
