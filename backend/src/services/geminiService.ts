// backend/src/services/geminiService.ts
import { GoogleGenAI } from '@google/genai';
import { buildSystemInstruction, buildUserPrompt } from './promptBuilder';
import { earthquakeTools } from './toolDeclarations';
import { getLatestEarthquakes, getSafetyGuide, getDashboardStatistics } from './toolImplementations';

let aiInstance: GoogleGenAI | null = null;

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not set. Please paste your Gemini API Key in the .env file and restart.');
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// Ordered fallback chain. Update this list when Google retires a model —
// check https://ai.google.dev/gemini-api/docs/changelog if you start seeing 404s again.
const MODEL_FALLBACK_CHAIN = ['gemini-3.5-flash', 'gemini-3.5-flash-lite'];

function isQuotaError(err: any) {
  return (
    err?.status === 429 ||
    err?.message?.includes('Quota') ||
    err?.message?.includes('429') ||
    err?.message?.includes('RESOURCE_EXHAUSTED')
  );
}

function isTransientModelError(err: any) {
  return (
    err?.status === 503 ||
    err?.status === 500 ||
    err?.message?.includes('503') ||
    err?.message?.includes('500') ||
    err?.message?.includes('UNAVAILABLE') ||
    err?.message?.includes('high demand')
  );
}

function isNotFoundError(err: any) {
  return (
    err?.status === 404 ||
    err?.message?.includes('404') ||
    err?.message?.includes('not found')
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callModel(ai: any, options: any, isStream: boolean) {
  return isStream
    ? await ai.models.generateContentStream(options)
    : await ai.models.generateContent(options);
}

/**
 * Tries the requested model with short backoff retries on temporary provider
 * errors, then walks down MODEL_FALLBACK_CHAIN when a model stays unavailable.
 * Returns both the result and which model actually served it, so callers
 * can log/display the real model instead of assuming the first one worked.
 */
async function generateWithFallback(ai: any, options: any, isStream: boolean): Promise<{ result: any; modelUsed: string }> {
  const startIndex = Math.max(0, MODEL_FALLBACK_CHAIN.indexOf(options.model));
  const chain = startIndex >= 0 && MODEL_FALLBACK_CHAIN.includes(options.model)
    ? MODEL_FALLBACK_CHAIN.slice(startIndex)
    : [options.model, ...MODEL_FALLBACK_CHAIN];

  let lastErr: any;

  for (let i = 0; i < chain.length; i++) {
    const model = chain[i];
    const attemptOptions = { ...options, model };

    const maxRetries = 3;
    for (let retry = 0; retry <= maxRetries; retry++) {
      try {
        const result = await callModel(ai, attemptOptions, isStream);
        return { result, modelUsed: model };
      } catch (err: any) {
        lastErr = err;

        if (isNotFoundError(err)) {
          console.warn(`Model "${model}" returned 404 (likely retired). Trying next model in chain...`);
          break; // move to next model, no point retrying a dead model name
        }

        if (isQuotaError(err) || isTransientModelError(err)) {
          if (retry < maxRetries) {
            const backoffMs = 700 * Math.pow(2, retry);
            console.warn(`Model "${model}" temporarily unavailable. Retrying in ${backoffMs}ms...`);
            await sleep(backoffMs);
            continue;
          }
          console.warn(`Model "${model}" still unavailable after retries. Trying next model in chain...`);
          break;
        }

        // Not a quota or 404 issue — don't keep retrying/falling back blindly.
        throw err;
      }
    }
  }

  throw lastErr ?? new Error('All models in fallback chain failed.');
}

export async function handleChatFlow(
  message: string,
  history: any[],
  context: any,
  onChunk: (text: string) => void
): Promise<{ modelUsed: string }> {
  const ai = getAiClient();
  const systemInstruction = buildSystemInstruction();
  const userPrompt = buildUserPrompt(message, context);

  const contents: any[] = history.slice(-15).map((m: any) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  contents.push({ role: 'user', parts: [{ text: userPrompt }] });

  const { result: response, modelUsed: firstModelUsed } = await generateWithFallback(ai, {
    model: MODEL_FALLBACK_CHAIN[0],
    contents: contents as any,
    config: {
      systemInstruction,
      tools: [earthquakeTools as any]
    }
  }, false);

  if (response.functionCalls && response.functionCalls.length > 0) {
    const call = response.functionCalls[0];
    let result: any;

    if (call.name === 'getLatestEarthquakes') {
      result = await getLatestEarthquakes(call.args as any);
    } else if (call.name === 'getSafetyGuide') {
      result = await getSafetyGuide(call.args as any);
    } else if (call.name === 'getDashboardStatistics') {
      result = await getDashboardStatistics();
    }

    // Use the model's actual returned content (preserves thoughtSignature),
    // instead of manually rebuilding the functionCall part — Gemini 3.x
    // rejects the next turn if thoughtSignature isn't echoed back.
    const modelTurnContent = response.candidates?.[0]?.content;
    if (modelTurnContent) {
      contents.push(modelTurnContent);
    } else {
      // Fallback if the SDK didn't expose candidates for some reason
      contents.push({
        role: 'model',
        parts: [{ functionCall: { name: call.name, args: call.args } }]
      });
    }

    contents.push({
      role: 'user',
      parts: [{ functionResponse: { name: call.name, response: { result } } }]
    });

    const { result: stream, modelUsed: secondModelUsed } = await generateWithFallback(ai, {
      model: MODEL_FALLBACK_CHAIN[0],
      contents: contents as any,
      config: { systemInstruction }
    }, true);

    for await (const chunk of stream) {
      if (chunk.text) onChunk(chunk.text);
    }

    return { modelUsed: secondModelUsed };
  } else {
    if (response.text) onChunk(response.text);
    return { modelUsed: firstModelUsed };
  }
}
