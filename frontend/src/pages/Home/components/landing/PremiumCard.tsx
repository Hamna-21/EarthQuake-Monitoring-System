import type { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
}

export default function PremiumCard({
  children,
  className = '',
}: PremiumCardProps) {
  return (
    <div
      className={`
        border border-white/10
        bg-white/[0.06]
        p-2.5 md:p-3
        shadow-lg shadow-black/15
        backdrop-blur-xl
        transition duration-300
        hover:-translate-y-0.5
        hover:border-cyan-200/30
        hover:bg-white/[0.09]
        ${className}
      `}
    >
      {children}
    </div>
  );
}