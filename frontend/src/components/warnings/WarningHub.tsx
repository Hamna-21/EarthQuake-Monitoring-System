import React, { useEffect, useState } from 'react';
import { Activity, X } from 'lucide-react';
import CrackOverlay from './components/CrackOverlay';

interface WarningHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WarningHub({ isOpen, onClose }: WarningHubProps) {
  const [showCrack, setShowCrack] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowCrack(false);
      const timer = setTimeout(() => {
        setShowCrack(true);
      }, 2400); // shake duration (3 shakes of 0.8s = 2.4s)
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      
      {/* Background Glow inside modal view */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-none bg-red-700/10 blur-[140px]" />
      </div>

      {/* Main Container styled to match home page exactly (rounded-none, red border, dark background) */}
      <div
        id="safety-hub"
        className="
        relative
        z-10
        animate-earthquake
        bg-[#120B0A]
        border
        border-red-900/40
        rounded-none
        w-full
        max-w-4xl
        max-h-[90vh]
        overflow-y-auto
        shadow-2xl
        shadow-red-950/40
        "
      >
        
        {/* Crack Overlay */}
        <CrackOverlay showCrack={showCrack} />
        
        {/* Header */}
        <div className="p-6 bg-black/40 border-b border-red-900/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-none animate-pulse">
              <Activity className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-[0.2em] text-white uppercase">
                Early Warning Hub
              </h3>
              <p className="text-xs font-light  text-red-100/60 mt-0.5">
                Critical global earthquake warning & preparation intelligence.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-red-200/70 hover:text-white font-mono text-xs uppercase px-3 py-1.5 border border-red-900/30 bg-white/5 rounded-none hover:bg-red-500/10 transition-all cursor-pointer flex items-center gap-1.5"
            title="Close Broadcast"
          >
            <X className="h-4 w-4" />
            <span>Close</span>
          </button>
        </div>

        {/* Video Content */}
        <div className="bg-black p-4 md:p-8 flex items-center justify-center border-b border-red-900/10">
          <div className="aspect-video w-full max-w-3xl bg-neutral-950 border border-red-900/20 shadow-inner relative">
            <iframe 
              className="w-full h-full absolute inset-0"
              src="https://www.youtube.com/embed/avvBpyh1kdE?si=tGbetz6P-Cgzn7dx" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-light  text-xs text-red-100/60">
              Broadcast synthesized live. Citizen safety protocols active.
            </span>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-none bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-red-700/30 hover:scale-105 hover:shadow-red-500/55 transition-all duration-300 cursor-pointer"
          >
            Acknowledge Safety Broadcast
          </button>
        </div>

      </div>
    </div>
  );
}
