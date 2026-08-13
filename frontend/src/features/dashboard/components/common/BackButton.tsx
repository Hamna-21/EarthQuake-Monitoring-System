import { ChevronLeft } from 'lucide-react';
import AppButton from './AppButton';

type BackButtonProps = { label?: string; onClick: () => void; className?: string };

export default function BackButton({ label = 'Back', onClick, className }: BackButtonProps) {
  return <AppButton variant="ghost" size="sm" icon={<ChevronLeft className="h-3.5 w-3.5" />} onClick={onClick} className={className}>{label}</AppButton>;
}
