export interface LogEntry {
  question: string;
  responseTimeMs: number;
  tokensUsed?: number;
  error?: string;
  model: string;
  timestamp: number;
}

// Record model, timing, and failure metadata for operational review without changing the streamed response.
export function logChatRequest(entry: LogEntry) {
  console.log(`[GeoPulse AI Log]`, JSON.stringify(entry, null, 2));
}
