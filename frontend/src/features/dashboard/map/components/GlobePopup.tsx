import { X } from 'lucide-react';
import type { Earthquake } from '@/types';
import MapPopup from './MapPopup';

export default function GlobePopup({ event, position, closing, onClose, onSelect, onDetails, mode = 'compact' }: { event: Earthquake; position: { x: number; y: number }; closing: boolean; onClose: () => void; onSelect: (event: Earthquake) => void; onDetails: (event: Earthquake) => void; mode?: 'compact' | 'historical' }) {
  return <div className={`absolute z-30 -translate-x-1/2 -translate-y-full ${closing ? 'animate-[globePopupOut_160ms_ease-in_forwards]' : 'animate-[globePopupIn_180ms_ease-out]'}`} style={{ left: position.x, top: position.y }}><div className="relative"><span className="absolute bottom-[-7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-[#071321]" /><button type="button" onClick={onClose} className="absolute right-1.5 top-1.5 z-10 rounded-md border border-white/10 bg-slate-950/70 p-1 text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Close earthquake details"><X className="h-3.5 w-3.5" /></button><MapPopup event={event} onSelect={onSelect} onDetails={onDetails} mode={mode} /></div></div>;
}
