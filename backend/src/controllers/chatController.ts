// backend/src/controllers/chatController.ts
import { Response } from 'express';
import { handleChatFlow } from '../services/geminiService';
import { getCachedResponse, setCachedResponse, isCacheable } from '../services/chatCache';
import { logChatRequest } from '../middleware/chatLogger';

export async function chatController(req: any, res: Response) {
  const { message, history = [], context } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (isCacheable(message)) {
    const cached = getCachedResponse(message);
    if (cached) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`data: ${JSON.stringify({ text: cached })}\n\n`);
      res.write(`data: [DONE]\n\n`);
      return res.end();
    }
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const startTime = Date.now();
  let fullResponse = '';
  let modelUsed = 'unknown';

  try {
    const flowResult = await handleChatFlow(message, history, context, (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    });

    modelUsed = flowResult.modelUsed;

    if (isCacheable(message) && fullResponse) {
      setCachedResponse(message, fullResponse);
    }

    logChatRequest({
      question: message,
      responseTimeMs: Date.now() - startTime,
      model: modelUsed,
      timestamp: Date.now()
    });

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err: any) {
    console.error('Chat controller error:', err);
    logChatRequest({
      question: message,
      responseTimeMs: Date.now() - startTime,
      error: err.message || 'Unknown error',
      model: modelUsed,
      timestamp: Date.now()
    });
    res.write(`data: ${JSON.stringify({ error: 'An error occurred while generating response.' })}\n\n`);
    res.end();
  }
}