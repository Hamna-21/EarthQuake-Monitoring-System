import { X } from 'lucide-react';
import IconButton from './IconButton';

type CloseButtonProps = { onClick: () => void; ariaLabel?: string; className?: string };

export default function CloseButton({ onClick, ariaLabel = 'Close', className }: CloseButtonProps) {
  return <IconButton ariaLabel={ariaLabel} onClick={onClick} variant="ghost" className={className}><X className="h-4 w-4" /></IconButton>;
}
