import { ReactNode } from 'react';

/** Renders or coordinates safety card for this frontend module. */
export default function SafetyCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-xl shadow-black/10 backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

/** Displays one focused safety recommendation in the safety page. */
