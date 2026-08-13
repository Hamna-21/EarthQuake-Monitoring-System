import type { ReactNode } from 'react';

type StatusBadgeProps = { tone?: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'neutral'; children: ReactNode; className?: string };

export default function StatusBadge({ tone = 'neutral', children, className = '' }: StatusBadgeProps) {
  return <span className={`dashboard-status dashboard-status--${tone} ${className}`}>{children}</span>;
}
