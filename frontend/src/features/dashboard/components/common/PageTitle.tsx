import type { ComponentType, ReactNode } from 'react';

type PageTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: ComponentType<{ className?: string }>;
  actions?: ReactNode;
  className?: string;
};

export default function PageTitle({ eyebrow, title, subtitle, icon: Icon, actions, className = '' }: PageTitleProps) {
  return (
    <header className={`dashboard-page-title ${className}`}>
      <div className="dashboard-page-title__content">
        {eyebrow && <p className="dashboard-page-title__eyebrow">{Icon && <Icon className="dashboard-page-title__icon" />}{eyebrow}</p>}
        <h1>{title}</h1>
        {subtitle && <p className="dashboard-page-title__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="dashboard-page-title__actions">{actions}</div>}
    </header>
  );
}
