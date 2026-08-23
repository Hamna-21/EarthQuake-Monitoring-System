import type { ReactNode } from 'react';

type StatusBadgeProps = { tone?: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'neutral'; children: ReactNode; className?: string };

/** Renders or coordinates status badge for this frontend module. */
export default function StatusBadge({ tone = 'neutral', children, className = '' }: StatusBadgeProps) {
  return <span className={`dashboard-status dashboard-status--${tone} ${className}`}>{children}</span>;
}
/** Displays a compact semantic status indicator for dashboard records. */
