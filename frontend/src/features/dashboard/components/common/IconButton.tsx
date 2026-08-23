import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'className' | 'children'> & {
  ariaLabel: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  className?: string;
};

/** Renders or coordinates icon button for this frontend module. */
export default function IconButton({ ariaLabel, children, variant = 'glass', className = '', type = 'button', ...props }: IconButtonProps) {
  return <button type={type} aria-label={ariaLabel} className={`dashboard-icon-button dashboard-button--${variant} ${className}`} {...props}>{children}</button>;
}
/** Provides the dashboard's shared icon-only action control. */
