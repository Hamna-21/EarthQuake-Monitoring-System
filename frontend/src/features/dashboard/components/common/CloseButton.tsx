import { X } from 'lucide-react';
import IconButton from './IconButton';
import { DASHBOARD_BUTTON_LABELS } from '@/features/dashboard/constants/dashboardText';

type CloseButtonProps = { onClick: () => void; ariaLabel?: string; className?: string };

export default function CloseButton({ onClick, ariaLabel = DASHBOARD_BUTTON_LABELS.close, className }: CloseButtonProps) {
  return <IconButton ariaLabel={ariaLabel} onClick={onClick} variant="ghost" className={className}><X className="h-4 w-4" /></IconButton>;
}
