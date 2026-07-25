interface CacheEntry {
  response: string;
  expiry: number;
}

const cache = new Map<string, CacheEntry>();

export function getCachedResponse(message: string): string | null {
  const cleanMsg = message.trim().toLowerCase();
  const entry = cache.get(cleanMsg);
  if (entry && entry.expiry > Date.now()) {
    return entry.response;
  }
  if (entry) cache.delete(cleanMsg);
  return null;
}

export function setCachedResponse(message: string, response: string, ttlMs: number = 3600000) {
  const cleanMsg = message.trim().toLowerCase();
  cache.set(cleanMsg, {
    response,
    expiry: Date.now() + ttlMs,
  });
}

const GENERAL_QA_KEYWORDS = [
  'what is magnitude',
  'what is richter scale',
  'what is epicenter',
  'what causes earthquakes',
  'what is seismology',
  'what is a tsunami',
  'how are earthquakes measured',
];

export function isCacheable(message: string): boolean {
  const cleanMsg = message.trim().toLowerCase();
  return GENERAL_QA_KEYWORDS.some((kw) => cleanMsg.includes(kw));
}
