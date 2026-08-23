import { X } from 'lucide-react';
import IconButton from './IconButton';
import { DASHBOARD_BUTTON_LABELS } from '@/features/dashboard/constants/dashboardText';

type CloseButtonProps = { onClick: () => void; ariaLabel?: string; className?: string };

/** Renders or coordinates close button for this frontend module. */
export default function CloseButton({ onClick, ariaLabel = DASHBOARD_BUTTON_LABELS.close, className }: CloseButtonProps) {
  return <IconButton ariaLabel={ariaLabel} onClick={onClick} variant="ghost" className={className}><X className="h-4 w-4" /></IconButton>;
}
/** Provides the shared close control for panels, dialogs, and popups. */
