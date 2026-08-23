import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Renders or coordinates history pagination for this frontend module. */
export default function HistoryPagination({
  page,
  count,
  limit,
  hasMore,
  loading,
  onPage,
}: {
  page: number;
  count: number;
  limit: number;
  hasMore: boolean;
  loading: boolean;
  onPage: (page: number) => void;
}) {
  if (!count && page === 1) return null;
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-300">
      <span className="font-semibold">
        Page {page} · Showing {count} of up to {limit} records
      </span>
      <div className="flex items-center gap-2">
        <button type="button" disabled={page <= 1 || loading} onClick={() => onPage(page - 1)} className="inline-flex items-center gap-2 rounded-xl border border-orange-200/20 bg-white/10 px-3 py-2 font-bold text-white transition hover:bg-white/15 disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <button type="button" disabled={!hasMore || loading} onClick={() => onPage(page + 1)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-700 via-orange-500 to-amber-400 px-3 py-2 font-bold text-white shadow-md shadow-orange-950/30 transition hover:brightness-110 disabled:opacity-40">
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
/** Provides pagination controls for the filtered historical earthquake records. */
