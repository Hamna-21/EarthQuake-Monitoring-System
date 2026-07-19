import { ReactNode } from 'react';
import AuthBackButton from './components/AuthBackButton';
import AuthMobileBrand from './components/AuthMobileBrand';
import AuthVisualPanel from './components/AuthVisualPanel';

interface AuthLayoutProps {
  children: ReactNode;
  onBackToHome: () => void;
}

export default function AuthLayout({ children, onBackToHome }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#050814] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_85%_60%,rgba(239,68,68,0.15),transparent_32%)]" />
      <AuthBackButton onBackToHome={onBackToHome} />
      <AuthVisualPanel />
      <main className="relative z-10 flex w-full flex-col items-center justify-center px-6 py-20 lg:w-1/2 lg:px-16">
        <AuthMobileBrand />
        <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.07] p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl md:p-10">
          <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-28 bg-red-500/10 blur-3xl" />
          {children}
        </div>
      </main>
    </div>
  );
}
