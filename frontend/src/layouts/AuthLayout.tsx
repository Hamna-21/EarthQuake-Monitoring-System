import { ReactNode } from 'react';
import AuthBackButton from '@/features/auth/components/AuthBackButton';
import AuthMobileBrand from '@/features/auth/components/AuthMobileBrand';
import AuthVisualPanel from '@/features/auth/components/AuthVisualPanel';

interface AuthLayoutProps {
  children: ReactNode;
  onBackToHome: () => void;
}

/** Provides the shared glass authentication frame and responsive visual/brand panels. */
export default function AuthLayout({ children, onBackToHome }: AuthLayoutProps) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__ambient" />
      <AuthBackButton onBackToHome={onBackToHome} />
      <AuthVisualPanel />
      <main className="auth-main">
        <AuthMobileBrand />
        <div className="auth-card">
          <div className="auth-card__glow auth-card__glow--top" />
          <div className="auth-card__glow auth-card__glow--bottom" />
          {children}
        </div>
      </main>
    </div>
  );
}
