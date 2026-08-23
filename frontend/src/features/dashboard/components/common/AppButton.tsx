import type { ButtonHTMLAttributes, ReactNode } from 'react';

type AppButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  className?: string;
};

/** Renders or coordinates app button for this frontend module. */
export default function AppButton({ variant = 'primary', size = 'md', icon, children, className = '', type = 'button', ...props }: AppButtonProps) {
  return <button type={type} className={`dashboard-button dashboard-button--${variant} dashboard-button--${size} ${className}`} {...props}>{icon}{children}</button>;
}
/** Provides the shared application action-button variants. */
