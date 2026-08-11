import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface RegisterSuccessOverlayProps {
  fullName: string;
}

export default function RegisterSuccessOverlay({ fullName }: RegisterSuccessOverlayProps) {
  return (
    <div className="absolute inset-0 bg-[#120B0A]/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-red-950/50">
        <CheckCircle2 className="h-10 w-10 text-emerald-400 animate-bounce" />
      </div>
      <h2 className="text-2xl font-black uppercase tracking-wider text-white">
        Account Instantiated
      </h2>
      <p className="text-sm font-light italic text-red-100/75 mt-2 max-w-xs">
        Welcome, {fullName}. Your telemetry receiver node has been allocated successfully.
      </p>
      <div className="w-48 h-1 bg-red-950/60 mt-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-orange-400 w-1/2 animate-shimmer" style={{ animationDuration: '1.2s' }} />
      </div>
    </div>
  );
}
