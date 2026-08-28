import { Button, type ButtonProps } from 'antd';
import type { ReactNode } from 'react';

type AppButtonProps = Omit<ButtonProps, 'className' | 'type' | 'size' | 'icon'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  className?: string;
};

/** Renders or coordinates app button for this frontend module. */
export default function AppButton({ variant = 'primary', size = 'md', icon, children, className = '', type = 'button', ...props }: AppButtonProps) {
  return <Button type="text" htmlType={type} icon={icon} className={`dashboard-button dashboard-button--${variant} dashboard-button--${size} ${className}`} {...props}>{children}</Button>;
}
/** Provides the shared application action-button variants. */
