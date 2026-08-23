import { ds } from '@/features/dashboard/utils/designSystem';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

/** Renders or coordinates badge for this frontend module. */
export default function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`${ds.badge} ${className}`}>
      {children}
    </span>
  );
}
/** Provides the shared compact status badge used across dashboard panels. */
