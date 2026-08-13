import type { HTMLAttributes, ReactNode } from 'react';

type AppCardProps = Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'children'> & {
  variant?: 'glass' | 'solid' | 'soft';
  children: ReactNode;
  className?: string;
};

export default function AppCard({ variant = 'glass', children, className = '', ...props }: AppCardProps) {
  return <div className={`dashboard-card dashboard-card--${variant} ${className}`} {...props}>{children}</div>;
}
