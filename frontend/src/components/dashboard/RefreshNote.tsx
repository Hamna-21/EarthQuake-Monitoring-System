import React from 'react';
import { AlertTriangle, Clock, Wifi } from 'lucide-react';
import { ds } from './designSystem';

export default function RefreshNote({
  isLoading,
  error,
}: {
  isLoading: boolean;
  error: string | null;
}) {
  if (error)
    return (
      <div className={`${ds.surface} mb-7 flex items-center gap-3 border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-900`}>
        <AlertTriangle className="h-5 w-5" /> {error}
      </div>
    );

  return (
    <div className={`${ds.surface} mb-8 flex items-center gap-3 px-5 py-4`}>
      {isLoading ? <Clock className="h-5 w-5 animate-spin text-cyan-700" /> : <Wifi className="h-5 w-5 text-emerald-600" />}
      <span className="text-sm font-medium text-slate-600">
        {isLoading
          ? "Refreshing earthquake records..."
          : "Live earthquake feed is connected."}
      </span>
    </div>
  );
}
