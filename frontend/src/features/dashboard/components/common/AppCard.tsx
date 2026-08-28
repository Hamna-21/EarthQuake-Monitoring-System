import { Card, type CardProps } from 'antd';
import type { ReactNode } from 'react';

type AppCardProps = Omit<CardProps, 'className' | 'children' | 'variant'> & {
  variant?: 'glass' | 'solid' | 'soft';
  children: ReactNode;
  className?: string;
};

/** Renders or coordinates app card for this frontend module. */
export default function AppCard({ variant = 'glass', children, className = '', ...props }: AppCardProps) {
  return <Card bordered={false} className={`dashboard-card dashboard-card--${variant} ${className}`} styles={{ body: { padding: 0 } }} {...props}>{children}</Card>;
}
/** Provides the shared dashboard card surface and spacing. */
