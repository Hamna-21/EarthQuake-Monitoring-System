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
    <div className="history-pagination">
      <span className="font-semibold">
        Page {page} · Showing {count} of up to {limit} records
      </span>
      <div className="history-pagination__actions">
        <button type="button" disabled={page <= 1 || loading} onClick={() => onPage(page - 1)} className="history-pagination__button history-pagination__button--previous">
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>
        <button type="button" disabled={!hasMore || loading} onClick={() => onPage(page + 1)} className="history-pagination__button history-pagination__button--next">
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
/** Provides pagination controls for the filtered historical earthquake records. */
