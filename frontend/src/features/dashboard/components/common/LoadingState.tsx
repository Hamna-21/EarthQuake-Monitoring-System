import type { ReactNode } from 'react';

type LoadingStateProps = { title?: string; message?: string; icon?: ReactNode; action?: ReactNode; className?: string };

export default function LoadingState({ title = 'Loading', message, icon, action, className = '' }: LoadingStateProps) {
  return <div className={`dashboard-state dashboard-loading-state ${className}`} role="status">{icon && <span>{icon}</span>}<strong>{title}</strong>{message && <p>{message}</p>}{action}</div>;
}
