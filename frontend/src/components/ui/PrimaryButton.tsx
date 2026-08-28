import { Button, type ButtonProps } from 'antd';

/** Renders or coordinates primary button for this frontend module. */
type Props = Omit<ButtonProps, 'type'> & { type?: 'button' | 'submit' | 'reset' };

export default function PrimaryButton({ className = '', type = 'button', ...props }: Props) {
  return <Button type="text" htmlType={type} className={`geopulse-primary-button ${className}`} {...props} />;
}
/** Provides the primary action button used across the application. */
