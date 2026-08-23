import type { ReactNode } from 'react';

type EmptyStateProps = { title: string; message?: string; icon?: ReactNode; action?: ReactNode; className?: string };

/** Renders or coordinates empty state for this frontend module. */
export default function EmptyState({ title, message, icon, action, className = '' }: EmptyStateProps) {
  return <div className={`dashboard-state dashboard-empty-state ${className}`}>{icon && <span>{icon}</span>}<strong>{title}</strong>{message && <p>{message}</p>}{action}</div>;
}
/** Renders a consistent empty-data message for dashboard sections. */
