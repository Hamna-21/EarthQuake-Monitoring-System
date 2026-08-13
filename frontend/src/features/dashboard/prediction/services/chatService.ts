export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export async function streamChatResponse(
  message: string,
  history: ChatMessage[],
  context: any,
  onChunk: (text: string) => void,
  onError: (err: string) => void,
  onDone: () => void,
  signal?: AbortSignal
) {
  const token = localStorage.getItem('geopulse_token');
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({ message, history, context }),
      signal,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No readable response stream');

    const decoder = new TextDecoder();
    let buffer = '';
    let receivedAnyChunk = false;
    let finished = false;

    // Process one SSE "event" block (may contain multiple `data:` lines
    // that need to be joined before JSON.parse, per the SSE spec).
    const processEvent = (rawEvent: string) => {
      const dataLines = rawEvent
        .split('\n')
        .filter((l) => l.trim().startsWith('data:'))
        .map((l) => l.trim().slice(5).trimStart());

      if (dataLines.length === 0) return;

      const dataStr = dataLines.join('\n');

      if (dataStr === '[DONE]') {
        finished = true;
        return;
      }

      try {
        const parsed = JSON.parse(dataStr);
        if (parsed.error) {
          onError(parsed.error);
          finished = true;
          return;
        }
        if (parsed.text) {
          receivedAnyChunk = true;
          onChunk(parsed.text);
        }
      } catch (e) {
        // Log instead of silently dropping — otherwise a bad chunk
        // just erases part of the answer with no trace.
        console.warn('[chatApi] Failed to parse SSE event:', dataStr, e);
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by a blank line (\n\n).
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const evt of events) {
        processEvent(evt);
        if (finished) {
          onDone();
          return;
        }
      }
    }

    // Stream closed — flush whatever's left in the buffer instead of
    // silently discarding a trailing chunk that had no closing \n\n.
    if (buffer.trim()) {
      processEvent(buffer);
    }

    if (!finished && !receivedAnyChunk) {
      onError('GeoBot closed the connection without sending a response.');
      return;
    }

    onDone();
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      onDone();
      return;
    }
      onError(err.message || 'Failed to connect to GeoBot');
  }
}
