import { ReactNode } from 'react';

/** Renders or coordinates auth error for this frontend module. */
export function AuthError({ error }: { error: string }) {
  if (!error) return null;
  return (
    <div className="auth-error">
      {error}
    </div>
  );
}

/** Renders or coordinates auth divider for this frontend module. */
export function AuthDivider() {
  return (
    <div className="auth-divider">
      <div className="auth-divider__line" />
      <span className="auth-divider__label">
        OR
      </span>
    </div>
  );
}

/** Renders or coordinates auth lead for this frontend module. */
export function AuthLead({ title, text }: { title: string; text: string }) {
  return (
    <div className="auth-lead">
      <h2 className="auth-lead__title">{title}</h2>
      <p className="auth-lead__text">{text}</p>
    </div>
  );
}

/** Renders or coordinates auth footer for this frontend module. */
export function AuthFooter({ children }: { children: ReactNode }) {
  return <div className="auth-footer">{children}</div>;
}

/** Supplies common visual framing and status content for auth forms. */
