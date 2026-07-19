import { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
}

export default function PremiumCard({ children, className = '' }: PremiumCardProps) {
  return (
    <div
      className={`border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-white/[0.09] ${className}`}
    >
      {children}
    </div>
  );
}
