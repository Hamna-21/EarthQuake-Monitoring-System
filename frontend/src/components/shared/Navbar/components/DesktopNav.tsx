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

/** Renders or coordinates desktop nav for this frontend module. */
export default function DesktopNav({ navLinks, handleLinkClick }: DesktopNavProps) {
  return (
    <div className="landing-navbar__links hidden md:flex">
      
  {navLinks.map((link) => {
  const Icon = link.icon;

  return (
    <button
  key={link.href}
  onClick={() => handleLinkClick(link.href)}
  disabled={link.disabled}
  className="landing-navbar__link"
>
  {Icon && (
    <Icon />
  )}
  <span>{link.name}</span>
</button>
  );
})}
    </div>
  );
}

/** Renders the desktop navigation links for the shared application navbar. */
