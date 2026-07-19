import { ReactNode } from 'react';

export default function SafetyCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/10 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}
