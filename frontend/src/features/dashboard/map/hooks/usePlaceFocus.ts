import { useEffect, useState } from 'react';
import { resolvePlace, type PlaceFocus } from '@/features/dashboard/map/services/placeSearch';

export function usePlaceFocus(query: string | undefined) {
  const [place, setPlace] = useState<PlaceFocus | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Cancel the previous geocoder request so stale results cannot move the globe after a newer search.
    const term = query?.trim() ?? '';
    if (!term) { setPlace(null); setError(null); return undefined; }
    const controller = new AbortController();
    setError(null);
    resolvePlace(term, controller.signal).then(setPlace).catch((reason: unknown) => {
      if (!(reason instanceof DOMException && reason.name === 'AbortError')) { setPlace(null); setError(reason instanceof Error ? reason.message : 'Location search failed.'); }
    });
    return () => controller.abort();
  }, [query]);
  return { place, error };
}
