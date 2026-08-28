import { Button, type ButtonProps } from 'antd';
import type { ReactNode } from 'react';

type IconButtonProps = Omit<ButtonProps, 'aria-label' | 'className' | 'children' | 'type'> & {
  ariaLabel: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  className?: string;
};

/** Renders or coordinates icon button for this frontend module. */
export default function IconButton({ ariaLabel, children, variant = 'glass', className = '', type = 'button', ...props }: IconButtonProps) {
  return <Button type="text" htmlType={type} aria-label={ariaLabel} className={`dashboard-icon-button dashboard-button--${variant} ${className}` as string} {...props}>{children}</Button>;
}
/** Provides the dashboard's shared icon-only action control. */
