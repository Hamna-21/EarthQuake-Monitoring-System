import type { HTMLAttributes, ReactNode } from 'react';

type GlassCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'div' | 'section' | 'article';
};

/** Renders or coordinates glass card for this frontend module. */
export default function GlassCard({ as: Element = 'div', children, className = '', ...props }: GlassCardProps) {
  return <Element className={`geopulse-glass-card ${className}`} {...props}>{children}</Element>;
}
/** Provides the reusable glassmorphism surface used by dashboard panels. */
