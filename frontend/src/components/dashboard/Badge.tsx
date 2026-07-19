import { ds } from './designSystem';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`${ds.badge} ${className}`}>
      {children}
    </span>
  );
}
