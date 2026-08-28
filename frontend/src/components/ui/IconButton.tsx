import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

/** Renders or coordinates icon button for this frontend module. */
export default function IconButton({ children, className = '', type = 'button', ...props }: IconButtonProps) {
  return <button type={type} className={`geopulse-icon-button ${className}`} {...props}>{children}</button>;
}
/** Provides a compact accessible icon-only button with shared styling. */
