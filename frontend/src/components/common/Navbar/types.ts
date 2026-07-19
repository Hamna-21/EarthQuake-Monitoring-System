import { LucideIcon } from 'lucide-react';

export interface NavLink {
  name: string;
  href: string;
  disabled?: boolean;
  icon?: LucideIcon;
}
