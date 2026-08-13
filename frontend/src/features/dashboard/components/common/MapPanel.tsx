import type { ReactNode } from 'react';

type MapPanelProps = { title?: string; subtitle?: string; actions?: ReactNode; children: ReactNode; className?: string };

export default function MapPanel({ title, subtitle, actions, children, className = '' }: MapPanelProps) {
  return <section className={`dashboard-map-panel ${className}`}><div className="dashboard-map-panel__header">{(title || subtitle) && <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>}{actions && <div>{actions}</div>}</div>{children}</section>;
}
