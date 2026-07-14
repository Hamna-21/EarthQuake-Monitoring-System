import React from 'react';

interface NavLink {
  name: string;
  href: string;
  disabled?: boolean;
}

interface DesktopNavProps {
  navLinks: NavLink[];
  handleLinkClick: (href: string) => void;
}

export default function DesktopNav({ navLinks, handleLinkClick }: DesktopNavProps) {
  return (
    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/80 tracking-wide">
      {navLinks.map((link) => (
        <button
          key={link.href}
          onClick={() => handleLinkClick(link.href)}
          className="relative hover:text-red-400 transition-all duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-red-500 after:to-orange-400 after:transition-all after:duration-300 hover:after:w-full"
        >
          {link.name}
        </button>
      ))}
    </div>
  );
}
