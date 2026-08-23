import type { ComponentType, ReactNode } from 'react';
import './dashboardCommon.css';

type PageTitleProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  actions?: ReactNode;
  rightControls?: ReactNode;
  backButton?: ReactNode;
  closeButton?: ReactNode;
  chips?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** Renders or coordinates page title for this frontend module. */
export default function PageTitle({ eyebrow, title, subtitle, icon: Icon, actions, rightControls, backButton, closeButton, chips, children, className = '' }: PageTitleProps) {
  return (
    <section className={`dashboard-page-title ${className}`}>
      <div className="dashboard-page-title__content">
        <div className="dashboard-page-title__topline">
          {eyebrow && <p className="dashboard-page-title__eyebrow">{Icon && <Icon className="dashboard-page-title__icon" />}{eyebrow}</p>}
          {(actions || rightControls || backButton || closeButton) && <div className="dashboard-page-title__actions">{actions}{rightControls}{backButton}{closeButton}</div>}
        </div>
        <h1>{title}</h1>
        {subtitle && <p className="dashboard-page-title__subtitle">{subtitle}</p>}
        {chips || children}
      </div>
    </section>
  );
}
/** Renders the consistent title and description header for dashboard pages. */
