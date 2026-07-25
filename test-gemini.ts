import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });

  const res = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: [{ role: 'user', parts: [{ text: 'Say "backend is working" and nothing else.' }] }]
  });
  console.log('Response:', res.text);
}

test().catch((err) => console.error('FAILED:', err));