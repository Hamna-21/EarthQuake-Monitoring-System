export interface LogEntry {
  question: string;
  responseTimeMs: number;
  tokensUsed?: number;
  error?: string;
  model: string;
  timestamp: number;
}

export function logChatRequest(entry: LogEntry) {
  console.log(`[GeoPulse AI Log]`, JSON.stringify(entry, null, 2));
}
