import React from 'react';
import { Clock } from 'lucide-react';

export default function RefreshNote({
  isLoading,
  error,
}: {
  isLoading: boolean;
  error: string | null;
}) {
  if (error)
    return (
      <div className="mt-16 mb-7 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-900">
        {error}
      </div>
    );

  return (
    <div className="mb-10 flex items-center gap-3 rounded-none border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <Clock className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
      <span className="text-sm font-medium text-slate-600">
        {isLoading
          ? "Refreshing earthquake records..."
          : "Live earthquake Feed is connected."}
      </span>
    </div>
  );
}
