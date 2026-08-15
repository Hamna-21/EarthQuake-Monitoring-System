import type { HTMLAttributes, ReactNode } from 'react';

type GlassCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'div' | 'section' | 'article';
};

export default function GlassCard({ as: Element = 'div', children, className = '', ...props }: GlassCardProps) {
  return <Element className={`rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-xl ${className}`} {...props}>{children}</Element>;
}
