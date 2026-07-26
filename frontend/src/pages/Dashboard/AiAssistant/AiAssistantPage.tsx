import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { DashboardProps } from '../../../components/dashboard/types';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

import { ChatMessage, streamChatResponse } from '../../../utils/chatApi';

export default function AiAssistantPage({ earthquakes, selectedEvent, openPage }: DashboardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm GeoPulse AI, your intelligent earthquake monitoring assistant. I can help explain earthquakes, seismic activity, dashboard analytics, safety procedures, historical events, and GeoPulse features. Ask me anything related to earthquakes or geological hazards.",
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsLoading(true);

    const context = {
      selectedEvent,
      currentView: 'ai_assistant',
    };

    let assistantContent = '';
    const tempAssistantMsg: ChatMessage = { role: 'assistant', content: '', timestamp: Date.now() };
    setMessages((prev) => [...prev, tempAssistantMsg]);

    streamChatResponse(
      text,
      updatedHistory,
      context,
      (chunk) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const list = [...prev];
          if (list.length > 0) {
            list[list.length - 1] = {
              role: 'assistant',
              content: assistantContent,
              timestamp: Date.now(),
            };
          }
          return list;
        });
      },
      (error) => {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: `Error: ${error}`, timestamp: Date.now() },
        ]);
      },
      () => {
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto h-[calc(100vh-180px)] min-h-0">
      {/* Header — fixed height, never shrinks or grows */}
      <div className="relative shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-5 shadow-2xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-16 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" /> GeoPulse AI Intelligence
            </p>
            <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-300 bg-clip-text text-3xl font-black tracking-tight text-transparent">
              Ask the Seismology Expert
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-400">
              Earthquakes, seismic risk, and live dashboard insight explained clearly.
            </p>
          </div>

          <span
            className={`hidden sm:flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
              isLoading
                ? 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200'
                : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isLoading ? 'bg-cyan-300 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            {isLoading ? 'Thinking…' : 'Online'}
          </span>
        </div>
      </div>

      {/* Chat area — takes remaining space, scrolls internally */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ChatWindow messages={messages} isLoading={isLoading} />
      </div>

      {/* Input — fixed height, pinned to bottom */}
      <div className="shrink-0">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}