import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

export default function IconButton({ children, className = '', type = 'button', ...props }: IconButtonProps) {
  return <button type={type} className={`rounded-full bg-white/10 p-2 text-white ${className}`} {...props}>{children}</button>;
}
